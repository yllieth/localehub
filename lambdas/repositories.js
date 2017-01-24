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
      "requestContext": event.requestContext,     // required to let foreign lambda access the authorization token
      "pathParameters": event.pathParameters,     // required to let foreign lambda access the username parameter in the url
      "queryStringParameters": { "type": "all" }
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

/**
 * Remove a lot of properties from original github response
 *
 * @param {repos[]} repositories - Github repositories
 */
function buildOutput(repositories) {
  let formattedList = [];

  for(let repo of repositories) {
    formattedList.push({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      owner: {
        id: repo.owner.id,
        login: repo.owner.login,
        description: repo.owner.bio,
        url: repo.owner.html_url,
        events_url: repo.owner.events_url,
        avatar_url: repo.owner.avatar_url,
        repos_url: repo.owner.repos_url,
        is_organization: repo.owner.type === 'User'
      },
      private: repo.private,
      fork: repo.fork
    });
  }

  return formattedList;
}