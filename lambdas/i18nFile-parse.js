'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });

exports.handler = function(event, context, callback) {
	let body = JSON.parse(event.body);
	let owner, repo, path, branch;

	try {
		owner = body.repo.split('/')[0];
		repo = body.repo.split('/')[1];
		path = encodeURIComponent(body.path);
		branch = body.branch;
	} catch(e) {
		done(callback, e, {message: "Missing parameter. Needs: repo (owner/name), path, branch", body}, 412);
		return;
	}

	let params = {
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-contents',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": event.requestContext,
			"pathParameters": { owner, repo, path },
			"queryStringParameters": { media: "raw", ref: branch }
		})
	};

	lambda.invoke(params, function(error, data) {
		let response       = JSON.parse(data.Payload);
		let responseStatus = 500;
		let responseBody   = {};

		try {
			responseBody = JSON.parse(response.body);
			responseStatus = response.statusCode;
		} catch (e) {
			responseBody = {message: "Given file is not a valid json object", body, fileContent: responseBody};
			responseStatus = 422;
		}

		if (responseStatus === 200) {
			responseBody = buildOutput(responseBody, body);
		} else if (responseStatus === 404) {
			responseBody = {message: "File not found", body};
		}

		done(callback, error, responseBody, responseStatus);
	});
};

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

function buildOutput(fileContent, body) {
	let keys = [];
	deepKeySerializer(null, fileContent, keys);

	return {
		languageCode: body.languageCode,
		count: keys.length,
		path: body.path,
		format: 'json',
		repo: body.repo,
		branch: body.branch
	};
}

function deepKeySerializer(serializedKey, json, keysList) {
	for (let key in json) {
		let value = json[key];
		let parent = (serializedKey === null) ? key : serializedKey + '.' + key;
		if (typeof value === 'object') { deepKeySerializer(parent, value, keysList); }
		if (typeof value === 'string') { keysList.push(parent); }
	}
}