'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });
let debug = true;

/**
 * PATCH Method
 * Wraps 1 call to dynamoDB :
 * - SELECT * FROM projects WHERE id = <projectId>
 * Wrap 4 calls to lambda functions :
 * - gh-get-user
 * - gh-get-repos-contents
 * - gh-put-repos-contents
 * - projects-edit
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /projects/:projectId/translations
 * === QUERY STRING PARAMETERS : Not applicable
 * === BODY : Object
 * - branch: {String}         The name of the working branch. This name is used to select pending changes to commit and to actually commit these changes
 *
 * Output: Object
 * {
 *    "project": {},
 *    "commits": []
 * }
 */
exports.handler = (event, context, callback) => {
	let projectId = event.pathParameters.id;
	let accessToken = event.requestContext.authorizer.githob;
	let body = JSON.parse(event.body);
	let loggedUser, repo, owner, pendingChanges, workingBranch;
	let i18nFilePaths = {};		// { en: 'locales/en.json', ...}
	let commits = [];

	checkRequirements(body)
		.then((_) => currentUser(accessToken))
		.then(user => {
			loggedUser = user;
			return findProject(projectId);
		})
		.then(project => {
			let repository = project.repository.fullName.split('/');
			owner = repository[0];
			repo = repository[1];
			workingBranch = body.branch;
			pendingChanges = project.pendingChanges;
			project.i18nFiles.map(file => i18nFilePaths[file.languageCode] = file.path);

			return selectChanges(pendingChanges, workingBranch, i18nFilePaths);
		})
		.then(changes => {
			let promise = Promise.resolve();

			for (let languageCode in changes) {
				promise = promise.then(() => {
					return getFile(accessToken, owner, repo, i18nFilePaths[languageCode], workingBranch)
						.then(fileInfo => apply(changes[languageCode], fileInfo))
						.then(update => {
							let path = update.path;
							let sha = update.sha;
							let branch = 'refs/heads/' + workingBranch;
							let content = new Buffer(JSON.stringify(update.fileContent, null, 2)).toString('base64');
							let message = 'Updates locales (' + path.split('/').pop() + ') via Localehub';
							let committer = JSON.stringify({ name: loggedUser.name, email: loggedUser.email });

							return commit(accessToken, owner, repo, path, sha, content, branch, message, committer);
						})
						.then(committed => commits.push(committed));
				});
			}

			return promise;
		})
		.then((_) => clearPendingChanges(accessToken, projectId, workingBranch, pendingChanges))
		.then(project => done(callback, {project, commits}, 200))
		.catch(error => done(callback, error, error.statusCode || 500));
};

// Checks presence of required properties of request body
function checkRequirements(body) {
	if (debug === true) {
		console.log('=== checkRequirements ===');
		console.log('inputs:', JSON.stringify({body}, null, 2));
	}

	let statusCode = 200;
	let message = '';
	let hasBranch = body => body.hasOwnProperty('branch') && body.branch.length > 0;

	if (hasBranch(body) === false) {
		statusCode = 422;
		message = 'Missing parameter "branch" in payload';
	}

	if (debug === true) {
		console.log('output:', JSON.stringify({statusCode, message}, null, 2));
	}

	return (statusCode >= 200 && statusCode < 300)
		? Promise.resolve({statusCode, message})
		: Promise.reject({statusCode, message});
}

// Gets connected github user
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

// Gets project whose id is provided in path parameters
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

// Select pending changes to be committed and groups pending change by language code
function selectChanges(pendingChanges, branch) {
	if (debug === true) {
		console.log('=== getChanges ===');
		console.log('inputs:', JSON.stringify({pendingChanges, branch}, null, 2));
	}

	let changes = pendingChanges.filter(change => change.branch === branch);
	let results = {};

	for (let change of changes) {
		(results.hasOwnProperty(change.languageCode) === true)
			? results[change.languageCode].push(change)
			: results[change.languageCode] = [change];
	}

	if (debug === true) {
		console.log('output:', JSON.stringify(results, null, 2));
	}

	return Promise.resolve(results);
}

// Gets the translation file on github according to given path/branch
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
			requestContext: { authorizer: { githob: accessToken }},
			pathParameters: { owner, repo, path },
			queryStringParameters: { media: "json", ref: branch }
		})
	});
}

// Applies pending changes to the JSON object
function apply(changes, fileInfo) {
	if (debug === true) {
		console.log('=== apply ===');
		console.log('inputs:', JSON.stringify({changes, fileInfo}, null, 2));
	}

	let errors = [];
	let updates = [];
	let fileContent = JSON.parse(new Buffer(fileInfo.content, fileInfo.encoding).toString());

	for (let change of changes) {
		let key = change.key.split('.');
		if (change.value.oldString === deepGetter(fileContent, key)) {
			deepSetter(fileContent, key, change.value.newString);
			updates.push({
				key: change.key,
				value: change.value.oldString + ' => ' + change.value.newString
			});
		} else {
			errors.push({change, remoteValue: deepGetter(fileContent, key)});
		}
	}

	if (debug === true) {
		console.log('output:', JSON.stringify({errors, updates}, null, 2));
	}

	return (errors.length === 0)
		? Promise.resolve({fileContent, name: fileInfo.name, path: fileInfo.path, sha: fileInfo.sha, size: fileInfo.size})
		: Promise.reject(errors);
}

// Commits changes (one commit per translation file)
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
			requestContext: { authorizer: { githob: accessToken }},
			pathParameters: { owner, repo, path },
			body: JSON.stringify({ message, content, sha, branch, committer })
		})
	});
}

// Removes committed changes from pending changes list on the project
function clearPendingChanges(accessToken, projectId, committedBranch, pendingChanges) {
	if (debug === true) {
		console.log('=== clearPendingChanges ===');
		console.log('inputs:', JSON.stringify({accessToken, projectId, committedBranch, pendingChanges}, null, 2));
	}

	let remainingChanges = pendingChanges.filter(change => change.branch !== committedBranch);

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:projects-edit',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			requestContext: { authorizer: { githob: accessToken }},
			pathParameters: { id: projectId },
			body: JSON.stringify({
				operation: 'set-pendingChanges',
				update: remainingChanges
			})
		})
	});
}

// ----------------------------------------------------------------------------

function done(callback, data, statusCode) {
	callback(null, {
		statusCode: statusCode,
		body: JSON.stringify(data, null, 2),
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		}
	});
}

function invokeLambdaWith(params) {
	let securityClean = params => {
		if (params.hasOwnProperty('FunctionName') === true) { params.FunctionName = params.FunctionName.split(':').pop(); }
		if (params.hasOwnProperty('Payload') === true) { params.Payload = JSON.parse(params.Payload); }
		if (params.Payload.hasOwnProperty('requestContext') === true && params.Payload.requestContext.hasOwnProperty('authorizer') === true) { params.Payload.requestContext.authorizer = null; }

		return params;
	};

	return new Promise((resolve, reject) => {
		lambda.invoke(params, function(error, data) {
			if (debug) {
				try {
					if (data.hasOwnProperty('Payload')) {
						data.Payload = JSON.parse(data.Payload);
						if (data.Payload.hasOwnProperty('body')) {
							data.Payload.body = JSON.parse(data.Payload.body);
						}
					}
				} catch (e) {
					reject(e);
					return;
				}

				console.log('params (' + params.FunctionName.split(':').pop() + ')', JSON.stringify({params}, null, 2));
				console.log('output (' + params.FunctionName.split(':').pop() + ')', JSON.stringify({error, data}, null, 2));
			}

			let responseStatus = data.Payload.statusCode || 500;
			let responseBody   = data.Payload.body || null;

			if (responseStatus >= 200 && responseStatus < 300) {
				resolve(responseBody);
			} else {
				if (Object.keys(responseBody).length > 0) {
					responseBody.statusCode = responseStatus;
					responseBody.inputParams = securityClean(params);
				}
				reject(responseBody);
			}
		});
	});
}

function deepSetter(obj, path, value) {
	// path = path.split('.');
	let i = 0;
	for (i = 0; i < path.length - 1; i++) {
		if (obj.hasOwnProperty(path[i]) === false) {
			obj[path[i]] = {};
		}
		obj = obj[path[i]];
	}

	obj[path[i]] = value;
}

function deepGetter(obj, path) {
	// path = path.split('.');
	let i = 0;
	for (i = 0; i < path.length - 1; i++) {
		if (obj.hasOwnProperty(path[i])) {
			obj = obj[path[i]];
		} else {
			return undefined;
		}
	}

	return obj[path[i]];
}
