'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let debug = true;

/**
 * POST Method
 * Wraps 2 calls of lambdas: gh-get-repos-git-refs, gh-post-repos-git-refs
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /branches/{username}/{repository}
 * - username:   {String} - Ex: yllieth
 * - repository: {String} - Ex: localehub
 *
 * === QUERY STRING PARAMETERS : None
 * === BODY : Object
 * - origin: {String} Name of the ref to branch from - Ex: master
 * - name:   {String} Name of the new branch - Ex: master-2
 *
 * Output:
 * {
 *   "ref": "refs/heads/featureA",
 *   "url": "https://api.github.com/repos/octocat/Hello-World/git/refs/heads/featureA",
 *   "object": {
 *     "type": "commit",
 *     "sha": "aa218f56b14c9653891f9e74264a383fa43fefbd",
 *     "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/aa218f56b14c9653891f9e74264a383fa43fefbd"
 *   }
 * }
 */
exports.handler = function(event, context, callback) {
	let token = event.requestContext.authorizer.githob;
	let owner = event.pathParameters.username;
	let repo = event.pathParameters.repository;
	let body = JSON.parse(event.body);

	getOriginalBranch(token, owner, repo, body.origin)
		.then(branch => { return createBranch(token, owner, repo, body.name, branch.object.sha)})
		.then(newBranch => {done(callback, newBranch, 200)})
		.catch(error => done(callback, error, error.statusCode || 500));
};

function getOriginalBranch(access_token, owner, repo, branch) {
	if (debug === true) {
		console.log('=== getOriginalBranch ===');
		console.log('inputs: ', JSON.stringify({access_token, owner, repo, branch}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-git-refs',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": { authorizer: { githob: access_token }},
			"pathParameters": { owner, repo, ref: encodeURIComponent('heads/' + branch) },
		})
	});
}

function createBranch(access_token, owner, repo, branch, sha) {
	if (debug === true) {
		console.log('=== createBranch ===');
		console.log('inputs: ', JSON.stringify({access_token, owner, repo, branch, sha}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-post-repos-git-refs',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": { authorizer: { githob: access_token }},
			"pathParameters": { owner, repo },
			"body": JSON.stringify({
				"ref": "refs/heads/" + branch,
				"sha": sha
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