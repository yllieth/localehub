'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let debug = true;

/**
 * GET Method
 * Wraps 1 call of lambdas: gh-get-users-repos
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /repositories/{username}
 * - username: {String} - Ex: yllieth
 *
 * === QUERY STRING PARAMETERS : None
 * === BODY : Not Applicable
 *
 * Output: Array
 * [
 *   {
 *     "id": 34584988,
 *     "name": "localehub",
 *     "fullName": "yllieth/localehub",
 *     "description": "[WebApp] Add/update versionned I18N support to an existing application",
 *     "url": "https://github.com/yllieth/localehub",
 *     "owner": {
 *       "id": 2495109,
 *       "login": "yllieth",
 *       "full_name": "Sylvain RAGOT",
 *       "description": "Frontend developer, passionated about web design, AngularJS lover. Having a beautiful life is easy: a motivating project, a whiteboard, and a laptop"
 *       "url": "https://github.com/yllieth",
 *       "events_url": "https://api.github.com/users/yllieth/events{/privacy}",
 *       "avatar_url": "https://avatars.githubusercontent.com/u/2495109?v=3",
 *       "repos_url": "https://api.github.com/users/yllieth/repos",
 *       "is_organization": false
 *     },
 *     "private": false,
 *     "fork": false
 *   }
 * ]
 */
exports.handler = function(event, context, callback) {
	let accessToken = event.requestContext.authorizer.githob;
	let username    = event.pathParameters.username;

	getGithubRepositories(accessToken, username)
		.then(repositories => buildOutput(repositories))
		.then(formattedRepos => done(callback, null, formattedRepos, 200))
		.catch(error => done(callback, error, null, 500));
};

function getGithubRepositories(accessToken, username) {
	if (debug === true) {
		console.log('=== getGithubRepositories ===');
		console.log('inputs: ', JSON.stringify({accessToken, username}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-users-repos',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			requestContext: { authorizer: { githob: accessToken }},
			pathParameters: { username },
			queryStringParameters: { type: "all" }
		})
	})
}

// ----------------------------------------------------------------------------

function buildOutput(repositories) {
	return new Promise(resolve => {
		let formattedList = [];

		for(let repo of repositories) {
			formattedList.push({
				id: repo.id,
				name: repo.name,
				fullName: repo.full_name,
				description: repo.description,
				url: repo.html_url,
				owner: {
					id: repo.owner.id,
					login: repo.owner.login,
					full_name: null,	// owner does not have name property in github response
					description: null,	// owner does not have bio/description property in github response
					url: repo.owner.html_url,
					events_url: repo.owner.events_url,
					avatar_url: repo.owner.avatar_url,
					repos_url: repo.owner.repos_url,
					is_organization: repo.owner.type !== 'User'
				},
				private: repo.private,
				fork: repo.fork
			});
		}

		resolve(formattedList);
	});
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