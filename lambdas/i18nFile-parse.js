'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });

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
    let response       = JSON.parse(data.Payload);
    let responseStatus = 500;
    let responseBody   = {};

    try {
      responseBody = JSON.parse(response.body);
      responseStatus = response.statusCode;
    } catch (e) {
      console.log('catch', e);
      responseBody = {message: "Given file is not a valid json object", body};
      responseStatus = 422;
    }

    console.log('response', responseBody);

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