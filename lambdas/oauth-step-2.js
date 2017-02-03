'use strict';

let https = require('https');
let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });
let debug = true;

let client_id = process.env.client_id;
let client_secret = process.env.client_secret;
let redirect_url = process.env.redirect_url;

/**
 * POST Method
 * Wraps 1 call on github and 1 write action on dynamoDB
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === ENVIRONEMENT VARIABLES:
 * - client_id:     {String} - Ex: 4c94850689acfd142b09                     (fake value)
 * - client_secret: {String} - Ex: bd2540a78665d4c7daa81712f23ac776bfbcaac7 (fake value)
 * - redirect_url:  {String} - Ex: http://localhost:3000
 *
 * === HEADERS : None
 * === PATH PARAMETERS : /organizations
 * === QUERY STRING PARAMETERS : None
 * === BODY : Object
 * - code:  {String} Oauth2 code returned by github after step1 of Oauth2 dance (did by the app)
 * - state: {String} Oauth2 state aimed to be the same given during step 1 (did by the app)
 *
 * Output: Object
 * { token: 4a56f7ad-621b-3c4a-9305-4acba389e410 }
 *
 * This token is an internal value which will be exchanged to the github access_token in custom authorizer
 */
exports.handler = function(event, context, callback) {
	checkBodyRequirements(event.body, callback)
		.then(body => getGithubToken(body.code, body.state))
		.then(githubToken => saveToken(githubToken))
		.then(internalToken => done(callback, null, internalToken, 200))
		.catch(error => done(callback, error, null, 500));
};

function getGithubToken(code, state) {
	if (debug === true) {
		console.log('=== getGithubToken ===');
		console.log('inputs:', JSON.stringify({code, state}, null, 2));
		console.log('process:', JSON.stringify({client_id, client_secret, redirect_url}, null, 2));
	}

	let params = {
		method: 'POST',
		host: 'github.com',
		path: '/login/oauth/access_token',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'}
	};

	return new Promise((resolve, reject) => {
		let request = https.request(params, response => {


			let body = '';
			response.on('data', chunck => body += chunck);
			response.on('end', (_) => {
				if (debug === true) {
					console.log('output:', JSON.stringify({body}, null, 2));
				}
				resolve(JSON.parse(body));
			});
			response.on('error', error => {
				if (debug === true) {
					console.log('output:', JSON.stringify({body}, null, 2));
				}
				reject(error);
			});
		});

		request.write(JSON.stringify({ client_id, client_secret, state, redirect_url, code }));
		request.end();
	});
}

function saveToken(githubToken) {
	if (debug === true) {
		console.log('=== saveToken ===');
		console.log('inputs:', JSON.stringify({githubToken}, null, 2));
	}

	return new Promise((resolve, reject) => {
		let pattern = new RegExp(/[a-f0-9]{40}/);
		if (githubToken.hasOwnProperty('access_token') === false || pattern.test(githubToken.access_token) === false) {
			let error = {message: 'Given token is not valid', metadata: {githubToken, pattern}};
			if (debug === true) {
				console.log('output:', JSON.stringify({error}, null, 2));
			}
			reject(error);
		} else {
			let token = generateUUID();
			let params = {
				TableName: 'tokens',
				Item: {token, github_token: githubToken.access_token, scope: githubToken.scope}
			};

			dynamo.put(params, function(error, data) {
				if (debug === true) {
					console.log('output:', JSON.stringify({error, data}, null, 2));
				}

				if (error) reject(error);
				else resolve({token});
			});
		}
	});
}

function checkBodyRequirements(body) {
	return new Promise((resolve, reject) => {
		try {
			body = JSON.parse(body);
		} catch(e) {
			reject(e);
			return;
		}

		if (body.hasOwnProperty('code') === false) { reject({ message: "Missing parameter 'code' in body", metadata: body}); return; }
		if (body.hasOwnProperty('state') === false) { reject({ message: "Missing parameter 'state' in body", metadata: body}); return; }

		resolve(body);
	});
}

function generateUUID() {
	let d = new Date().getTime();
	let uuid = 'xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

	return uuid;
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