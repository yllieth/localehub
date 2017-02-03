'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let debug = true;

/**
 * GET Method
 * Wraps 1 call of lambdas: gh-get-user-orgs
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /current-user/organizations
 * === QUERY STRING PARAMETERS : None
 * === BODY : Not applicable
 *
 * Output: Array
 * [
 *   {
 *     "id": 6170002,
 *     "login": "PredicSis",
 *     "full_name": "PredicSis",
 *     "description": "",
 *     "url": "https://github.com/PredicSis",
 *     "events_url": "https://api.github.com/orgs/PredicSis/events",
 *     "avatar_url": "https://avatars.githubusercontent.com/u/6170002?v=3",
 *     "repos_url": "https://api.github.com/orgs/PredicSis/repos",
 *     "is_organization": true
 *   }
 * ]
 */
exports.handler = function(event, context, callback) {
	let accessToken = event.requestContext.authorizer.githob;

	getOrganizations(accessToken)
		.then(organizations => done(callback, null, buildOutput(organizations), 200))
		.catch(error => done(callback, error, null, 500));
};

function getOrganizations(accessToken) {
	if (debug === true) {
		console.log('=== currentUser ===');
		console.log('inputs:', JSON.stringify({accessToken}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-user-orgs',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({requestContext: { authorizer: { githob: accessToken }}})
	});
}

// ----------------------------------------------------------------------------

function buildOutput(githubOrganizations) {
	let orgs = [];

	for (let organization of githubOrganizations) {
		orgs.push({
			id: organization.id,
			login: organization.login,
			full_name: organization.login,
			description: organization.description,
			url: 'https://github.com/' + organization.login,
			events_url: organization.events_url,
			avatar_url: organization.avatar_url,
			repos_url: organization.repos_url,
			is_organization: true
		});
	}

	return orgs;
}

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