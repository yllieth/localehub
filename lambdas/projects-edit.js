'use strict';

let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

exports.handler = function(event, context, callback) {
	let projectId = event.pathParameters.id;
	let params = buildQuery(projectId, JSON.parse(event.body));
	console.log('params:', JSON.stringify(params, null, 2));

	dynamo.update(params, function(error, data) {
		// console.log('error:', JSON.stringify(error, null, 2));
		// console.log('data:', JSON.stringify(data, null, 2));

		let responseBody = (error) ? data : data.Attributes;
		let responseStatus = (error) ? 500 : 200;

		done(callback, error, responseBody , responseStatus);
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

function buildQuery(projectId, body) {
	let operation = body.operation;
	let changes = body.update;
	let params = {};

	if (operation === 'append-pendingChanges') {
		params = {
			TableName: 'projects',
			Key: {id: projectId},
			ReturnValues: 'ALL_NEW',
			UpdateExpression: 'set pendingChanges = list_append (pendingChanges, :editedValue)',
			ExpressionAttributeValues: { ':editedValue': [changes] }
		};
	} else if (operation === 'set-pendingChanges') {
		params = {
			TableName: 'projects',
			Key: {id: projectId},
			ReturnValues: 'ALL_NEW',
			UpdateExpression: 'set pendingChanges = :pendingChanges',
			ExpressionAttributeValues: { ':pendingChanges': changes }
		};
	}

	return params;
}