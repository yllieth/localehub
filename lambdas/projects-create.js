'use strict';

let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

exports.handler = function(event, context, callback) {
  let body = JSON.parse(event.body);

  let params = {
    TableName: 'projects',
    Item: body
  };

  dynamo.put(params, function(error, data) {
    console.log('error', error);
    console.log('data', body);
    done(callback, error, body, 200);
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