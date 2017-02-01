'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });

exports.handler = function(event, context, callback) {
	let params = {
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-user',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": event.requestContext
		})
	};

	lambda.invoke(params, function(error, data) {
		if (error) {
			done(callback, error, JSON.parse(data), data.StatusCode);
		} else {
			let response = JSON.parse(JSON.parse(data.Payload).body);
			done(callback, null, buildOutput(response), data.StatusCode);
		}
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

function buildOutput(user) {
	// format user
	return {
		id: user.id,
		login: user.login,
		description: user.bio,
		url: user.html_url,
		events_url: user.events_url,
		avatar_url: user.avatar_url,
		repos_url: user.repos_url,
		is_organization: user.type !== 'User'
	};
}