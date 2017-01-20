'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({
  region: 'eu-central-1'
});

exports.handler = function(event, context, callback) {
  let body = JSON.parse(event.body);

  let params = {
    FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-contents',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({
      "requestContext": event.requestContext,
      "pathParameters": {owner: body.owner, repo: body.repo, path: encodeURIComponent(body.path)},
      "queryStringParameters": { "media": "raw" }
    })
  };

  lambda.invoke(params, function(error, data) {
    if (error) {
      done(callback, error, JSON.parse(data), data.StatusCode);
    } else {
      let response = JSON.parse(JSON.parse(data.Payload).body);
      if (typeof response === 'object') {
        done(callback, null, buildOutput(response, body), data.StatusCode);
      } else {
        done(callback, {message: "Given file is not a json"}, null, 422);
      }
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

function buildOutput(fileContent, body) {
  let keys = [];
  deepKeySerializer(null, fileContent, keys);

  return {
    languageCode: body.languageCode,
    count: keys.length,
    path: body.path,
    format: 'json'
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