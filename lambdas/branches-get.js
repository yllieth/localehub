'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({
	region: 'eu-central-1'
});

exports.handler = function(event, context, callback) {
	let params = {
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-branches',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({
			"requestContext": event.requestContext,
			"pathParameters": { owner: event.pathParameters.username, repo: event.pathParameters.repository },
			"queryStringParameters": { protected: "false" }
		})
	};

	lambda.invoke(params, function(error, data) {
		console.log('error', error);
		console.log('data', data);
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

/**
 * Only returns branches' name
 */
function buildOutput(branches) {
	return branches.map(branch => branch.name);
}