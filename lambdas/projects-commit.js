'use strict';

let AWS = require('aws-sdk');
let crypto = require('crypto');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });
let debug = true;

// - [DYNAMO]: READ project, get pending changes for the given branch and group them by languages
// - [GITHUB]: CREATE a new branch if there is at least 1 pending change
// - [INTERN]: ITERATE over each languages having a pending change and:
//      - [GITHUB]: READ current translation and check if it matches with oldString of pending change
//      - [INTERN]: UPDATE translation file with pending change and encode it in base64
//      - [GITHUB]: CREATE a new commit with all pending changes
// - [GITHUB]: CREATE a new pull request
// - [DYNAMO]: UPDATE project to reset pending changes

exports.handler = (event, context, callback) => {
	let projectId = event.pathParameters.id;
	let accessToken = event.requestContext.authorizer.githob;
	// let body = JSON.parse(event.body);
	let responses = {
		user: null,			// connected github user
		project: null,      // project from dynamoDB
		owner: null,
		repo: null,
		changes: null,      // list of pending changes for the given branch grouped by languageCode: { en-US: [{...}, {...}], pl: [{...}, {...}]}
		branch: null,       // branch created to contain all pending changes applied to translation files
		commits: [],		// list of commits created to apply changes (must be initialized with an empty array to allow push())
		pr: null
	};

	currentUser(accessToken)
		.then(user => {
			responses.user = user;
			return findProject(projectId);
		})
		.then(project => {
			let repository = project.repository.fullName.split('/');
			responses.project = project;
			responses.owner = repository[0];
			responses.repo = repository[1];

			return getChanges(responses.project.pendingChanges, responses.project.lastActiveBranch);
		})
		.then(changes => {
			responses.changes = changes;
			let currentBranchName = responses.project.lastActiveBranch;
			let newBranchName = currentBranchName + '-localehub';

			return createBranch(accessToken, responses.owner, responses.repo, currentBranchName, newBranchName);
		})
		.then(newBranch => {
			responses.branch = newBranch;
			return processChanges(accessToken, responses);
		})
		.then((_) => {
			let owner = responses.owner;
			let repo = responses.repo;
			let oldBranchName = responses.project.lastActiveBranch;
			let newBranchName = responses.branch.ref;
			let changes = responses.changes;

			return createPullRequest(accessToken, owner, repo, oldBranchName, newBranchName, changes);
		})
		.then(pullRequest => {
			responses.pr = pullRequest;
			return clearPendingChanges(accessToken, responses.project);
		})
		.then(project => done(callback, null, project, 200))
		.catch(error => done(callback, error, null, 500));
};

function currentUser(accessToken) {
	if (debug === true) {
		console.log('=== currentUser ===');
		console.log('inputs:', JSON.stringify({accessToken}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-user',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({requestContext: { authorizer: { githob: accessToken }}})
	});
}

function findProject(projectId) {
	if (debug === true) {
		console.log('=== findProject ===');
		console.log('inputs:', JSON.stringify({projectId}, null, 2));
	}

	return new Promise((resolve, reject) => {
		dynamo.get({TableName: 'projects', Key: { id: projectId }}, function(error, data) {
			if (debug === true) {
				console.log('output:', JSON.stringify({error, data}, null, 2));
			}

			if (error) reject(error); else resolve(data.Item);
		});
	});
}

function getChanges(pendingChanges, branch) {
	if (debug === true) {
		console.log('=== getChanges ===');
		console.log('inputs:', JSON.stringify({pendingChanges, branch}, null, 2));
	}

	return new Promise(resolve => {
		let changes = pendingChanges.filter(change => change.branch === branch);
		let results = {};

		for (let change of changes) {
			if (results.hasOwnProperty(change.languageCode) === true) {
				results[change.languageCode].push(change);
			} else {
				results[change.languageCode] = [change];
			}
		}

		if (debug === true) {
			console.log('output:', JSON.stringify({results}, null, 2));
		}
		resolve(results);
	});
}

function createBranch(accessToken, username, repository, origin, name) {
	if (debug === true) {
		console.log('=== createBranch ===');
		console.log('inputs:', JSON.stringify({accessToken, username, repository, origin, name}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:branch-create',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": { authorizer: { githob: accessToken }},
			"pathParameters": { username, repository },
			"body": JSON.stringify({ origin, name })
		})
	});
}

function processChanges(accessToken, responses) {
	let promise = Promise.resolve();

	for (let languageCode in responses.changes) {
		promise = promise.then(() => doProcess(accessToken, languageCode, responses));
	}

	return promise;
}

function doProcess(accessToken, languageCode, responses) {
	let oldBranchName = responses.project.lastActiveBranch;											// Ex: gh-test
	let newBranchName = responses.branch.ref;														// Ex: refs/heads/gh-test-localehub
	let repository = responses.project.repository.fullName.split('/');								// Ex: yllieth/localehub
	let owner = repository[0];																		// Ex: yllieth
	let repo = repository[1];																		// Ex: localehub
	let path = responses.project.i18nFiles.filter(file => (file.languageCode === languageCode))[0].path;
	let previousSha;

	return getFile(accessToken, owner, repo, path, oldBranchName)
		.then(fileInfo => {
			previousSha = fileInfo.sha;
			let decodedFile = JSON.parse(new Buffer(fileInfo.content, fileInfo.encoding).toString());

			return apply(responses.changes[languageCode], decodedFile);
		})
		.then(updatedFile => {
			// ! NOTE: It's important to give additional parameters to JSON.stringify while encoding updatedFile
			// ! But it's hard to know the (second parameter) number of spaces/tabs
			let content = new Buffer(JSON.stringify(updatedFile, null, 2)).toString('base64');
			let message = 'Updates locales (' + path.split('/').pop() + ') via Localehub';
			let committer = JSON.stringify({ name: responses.user.name, email: responses.user.email });

			return commit(accessToken, owner, repo, path, previousSha, content, newBranchName, message, committer);
		})
		.then(commitDetails => responses.commits.push(commitDetails));
}

function getFile(accessToken, owner, repo, path, branch) {
	if (debug === true) {
		console.log('=== getFile ===');
		console.log('inputs:', JSON.stringify({accessToken, owner, repo, path, branch}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-contents',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": { authorizer: { githob: accessToken }},
			"pathParameters": { owner, repo, path },
			"queryStringParameters": { "media": "json", ref: branch }
		})
	});
}

function apply(changes, fileContent) {
	if (debug === true) {
		console.log('=== apply ===');
		console.log('inputs:', JSON.stringify({changes, fileContent}, null, 2));
	}

	return new Promise((resolve, reject) => {
		let errors = [];
		let updates = [];

		for (let change of changes) {
			let key = change.key.split('.');
			if (change.value.oldString === deepGetter(fileContent, key)) {
				deepSetter(fileContent, key, change.value.newString);
				updates.push({ key: change.key, value: change.value.oldString + ' => ' + change.value.newString});
			} else {
				errors.push({change, remoteValue: deepGetter(fileContent, key)});
			}
		}

		if (debug === true) {
			console.log('output:', JSON.stringify({errors, updates}, null, 2));
		}

		(errors.length === 0) ? resolve(fileContent) : reject(errors);
	});
}

function commit(accessToken, owner, repo, path, sha, content, branch, message, committer) {
	if (debug === true) {
		console.log('=== commit ===');
		console.log('inputs:', JSON.stringify({accessToken, owner, repo, path, sha, content, branch, committer}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-put-repos-contents',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": { authorizer: { githob: accessToken }},
			"pathParameters": { owner, repo, path },
			"body": JSON.stringify({ message, content, sha, branch, committer })
		})
	});
}

function createPullRequest(accessToken, owner, repo, oldBranchName, newBranchName, changes) {
	if (debug === true) {
		console.log('=== createPullRequest ===');
		console.log('inputs:', JSON.stringify({accessToken, owner, repo, oldBranchName, newBranchName, changes}, null, 2));
	}

	let updatedLanguages = Object.keys(changes);

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-post-repos-pulls',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": {authorizer: {githob: accessToken}},
			"pathParameters": {owner, repo},
			"body": JSON.stringify({
				title: 'Updating locales (' + updatedLanguages.join(', ') + ')',
				head: newBranchName,
				base: oldBranchName,
				body: createPRMessageFrom(changes),
				maintainer_can_modify: false
			})
		})
	});
}

function clearPendingChanges(accessToken, project) {
	if (debug === true) {
		console.log('=== clearPendingChanges ===');
		console.log('inputs:', JSON.stringify({accessToken, project}, null, 2));
	}

	let committedBranch = project.lastActiveBranch;
	let remainingChanges = project.pendingChanges.filter(change => change.branch !== committedBranch);

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:projects-edit',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": { authorizer: { githob: accessToken }},
			"pathParameters": { id: project.id },
			"body": JSON.stringify({
				operation: 'set-pendingChanges',
				update: remainingChanges
			})
		})
	});
}

// ----------------------------------------------------------------------------

function done(callback, error, data, statusCode) {
	callback(error, {
		statusCode: statusCode,
		body: error ? error : JSON.stringify(data),
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		}
	});
}

function invokeLambdaWith(params) {
	return new Promise((resolve, reject) => {
		lambda.invoke(params, function(error, data) {
			if (debug) {
				console.log('params (' + params.FunctionName.split(':').pop() + ')', JSON.stringify({params}, null, 2));
				console.log('output (' + params.FunctionName.split(':').pop() + ')', JSON.stringify({error, data}, null, 2));
			}

			let response       = JSON.parse(data.Payload);
			let responseStatus = 500;
			let responseBody   = {};

			try {
				responseBody = JSON.parse(response.body);
				responseStatus = response.statusCode;
			} catch (e) {
				reject(e);
				return;
			}

			if (responseStatus === 200 || responseStatus === 201) {
				resolve(responseBody);
			} else if (responseStatus === 404) {
				reject("Not found");
			}

			return;
		});
	});
}

function deepSetter(obj, path, value) {
	// path = path.split('.');
	let i = 0;
	for (i = 0; i < path.length - 1; i++) {
		obj = obj[path[i]];
	}

	obj[path[i]] = value;
}

function deepGetter(obj, path) {
	// path = path.split('.');
	let i = 0;
	for (i = 0; i < path.length - 1; i++) {
		obj = obj[path[i]];
	}

	return obj[path[i]];
}

// function deepCopy(obj) {
// 	let newObj = obj;
//
// 	if (obj && typeof obj === "object") {
// 		newObj = Object.prototype.toString.call(obj) === "[object Array]" ? [] : {};
// 		for (let i in obj) {
// 			newObj[i] = deepCopy(obj[i]);
// 		}
// 	}
// 	return newObj;
// }

function createPRMessageFrom(changes) {
	let message = '';

	for (let languageCode in changes) {
		message += '#### ' + languageCode;

		for (let change of changes[languageCode]) {
			message += '\n- ' + change.key + ':\n\t- **Before**: _' + change.value.oldString + '_\n\t- **After**: _' + change.value.newString + '_\n\n';
		}
	}

	return message;
}