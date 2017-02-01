'use strict';

let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

exports.handler = function(event, context, callback) {
	let projectId = event.pathParameters.id;

	dynamo.get({TableName: 'projects', Key: { id: projectId }}, function(error, data) {
		if (error) {
			done(callback, error, {message: 'Project not found', body: projectId}, 404);
		} else {
			let project = data.Item;
			done(callback, error, project, 200);
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