'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });
let debug = true;

/**
 * GET Method
 * Wraps 1 call to dynamoDB, and 1 call of lambda: gh-get-repos-contents
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /projects/:projectId
 * === QUERY STRING PARAMETERS :
 * - *languageCode: the language code of the requested contents
 * -  branch: the name of the branch on which get contents. If absent, the project.lastActiveBranch is used
 * === BODY : Not applicable
 *
 * Output: Object
 * {
 *    "metadata": {
 *      "branch": "gh-test",
 *      "format": "json",
 *      "count": 26,
 *      "languageCode": "en-US",
 *      "path": "locales/en-US.json",
 *      "repo": "localehub-test"
 *    },
 *    "content": {...}
 * }
 */
exports.handler = function(event, context, callback) {
	let accessToken = event.requestContext.authorizer.githob;
	let projectId = event.pathParameters.id;
	let languageCode = event.queryStringParameters.languageCode;
	let repo, owner, path, requestedBranchName;

	findProject(projectId)
		.then(project => {
			repo = project.repository.name;
			owner = project.repository.owner.login;
			let i18nFile = project.i18nFiles.filter(fileInfo => fileInfo.languageCode === languageCode);
			path = i18nFile[0].path;
			return guessBranchName(event, project);
		})
		.then(branchName => {
			requestedBranchName = branchName;
			return getContents(accessToken, owner, repo, path, branchName);
		})
		.then(fileContent => buildOutput(fileContent, repo, requestedBranchName, languageCode, path))
		.then(formattedOutput => done(callback, formattedOutput, 200))
		.catch(error => done(callback, error, error.statusCode || 500));
};

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

function getContents(accessToken, owner, repo, path, branch) {
	if (debug === true) {
		console.log('=== getContents ===');
		console.log('inputs:', JSON.stringify({accessToken, owner, repo, path, branch}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-contents',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": { authorizer: { githob: accessToken }},
			"pathParameters": { owner, repo, path },
			"queryStringParameters": { "media": "raw", ref: branch }
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

function guessBranchName(event, project) {
	if (debug === true) {
		console.log('=== getBranchName ===');
		console.log('inputs:', JSON.stringify({event, project}, null, 2));
	}

	let branchName = (event.hasOwnProperty('queryStringParameters') && event.queryStringParameters.hasOwnProperty('branch'))
		? event.queryStringParameters.branch
		: project.lastActiveBranch;

	if (debug === true) {
		console.log('output:', JSON.stringify({branchName}, null, 2));
	}

	return Promise.resolve(branchName);
}

function buildOutput(fileContent, repo, branch, languageCode, path) {
	if (debug === true) {
		console.log('=== buildOutput ===');
		console.log('inputs:', JSON.stringify({fileContent, repo, branch, languageCode, path}, null, 2));
	}

	let keys = [];
	deepKeySerializer(null, fileContent, keys);
	let count = keys.length;
	let output = {
		metadata: { languageCode, path, count, format: 'json', repo, branch },
		content: fileContent
	};

	if (debug === true) {
		console.log('output:', JSON.stringify({output}, null, 2));
	}

	return Promise.resolve(output);
}

function deepKeySerializer(serializedKey, json, keysList) {
	for (let key in json) {
		let value = json[key];
		let parent = (serializedKey === null) ? key : serializedKey + '.' + key;
		if (typeof value === 'object') { deepKeySerializer(parent, value, keysList); }
		if (typeof value === 'string') { keysList.push(parent); }
	}
}