'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

exports.handler = function(event, context, callback) {
  let projectId = event.pathParameters.id;
  let languageCode = event.queryStringParameters.languageCode;

  dynamo.get({TableName: 'projects', Key: { id: projectId }}, function(error, data) {
    if (error) {
      done(callback, error, {message: 'Project not found', body: projectId}, 404);
    } else {
      let project = data.Item;
      let owner = project.owner.split('/').pop();
      let repo = project.name;
      let i18nFile = project.i18nFiles.filter(fileInfo => fileInfo.languageCode === languageCode);
      let path = i18nFile[0].path;
      let branch = (event.hasOwnProperty('queryStringParameters') && event.queryStringParameters.hasOwnProperty('branch'))
        ? event.queryStringParameters.branch
        : project.lastActiveBranch;

      let params = {
        FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-contents',
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify({
          "requestContext": event.requestContext,
          "pathParameters": {owner, repo, path},
          "queryStringParameters": { "media": "raw", ref: branch }
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
          responseBody = {message: "Given file is not a valid json object"};
          responseStatus = 422;
        }

        if (responseStatus === 200) {
          responseBody = buildOutput(responseBody, repo, branch, languageCode, path);
        } else if (responseStatus === 404) {
          responseBody = {message: "File not found"};
        }

        done(callback, error, responseBody, responseStatus);
      });
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

function buildOutput(fileContent, repo, branch, languageCode, path) {
  let keys = [];
  deepKeySerializer(null, fileContent, keys);
  let count = keys.length;

  return {
    metadata: { languageCode, path, count, format: 'json', repo, branch },
    content: fileContent
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