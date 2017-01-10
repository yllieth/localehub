'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({
  region: 'eu-central-1'
});

exports.handler = function(event, context, callback) {
  let params = {
    FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-users-repos',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({
      "requestContext": event.requestContext,
      "pathParameters": event.pathParameters
    })
  };

  lambda.invoke(params, function(error, data) {
    if (error) {
      done(callback, error, JSON.parse(data), data.StatusCode);
    } else {
      let response = JSON.parse(JSON.parse(data.Payload).body);
      done(callback, null, format(response), data.StatusCode);
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

function format(repositories) {
  let formattedList = [];

  for(let repo of repositories) {
    formattedList.push({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      owner: {
        id: repo.owner.id,
        login: repo.owner.login,
        description: null,
        url: repo.owner.url,
        events_url: repo.owner.events_url,
        avatar_url: repo.owner.avatar_url,
        repos_url: repo.owner.repos_url,
        is_organization: repo.owner.type !== 'User'
      },
      private: repo.private,
      fork: repo.fork
    })
  }

  return formattedList;
}