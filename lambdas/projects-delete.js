'use strict';

let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

exports.handler = function(event, context, callback) {
  let projectId = event.pathParameters.id;
  let params = {TableName: 'projects', Key: { id: projectId }};

  dynamo.get(params, function(error, data) {
    console.log('Error:', error);
    console.log('Data:', JSON.stringify(data, null, 2));

    if (data.hasOwnProperty('Item') === true) {
      let project = data.Item;
      dynamo.delete(params, err => done(callback, err, project, (err) ? 500 : 200));
    } else {
      done(callback, error, { message: "Project not found", body: { id: projectId }}, 404);
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