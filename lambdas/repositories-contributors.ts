'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let debug = true;

/**
 * GET Method
 * Wraps 1 call of lambdas: gh-get-repos-contributors
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /repositories/{username}/{reponame}
 * - username: {String} - Ex: yllieth
 * - reponame: {String} - Ex: localehub
 *
 * === QUERY STRING PARAMETERS : None
 * === BODY : Not Applicable
 *
 * Output: Array
 * [
 *   {
 *     "id": 2495109,
 *     "login": "yllieth",
 *     "full_name": "Sylvain RAGOT",
 *     "description": "Frontend developer, passionated about web design, AngularJS lover. Having a beautiful life is easy: a motivating project, a whiteboard, and a laptop"
 *     "url": "https://github.com/yllieth",
 *     "events_url": "https://api.github.com/users/yllieth/events{/privacy}",
 *     "avatar_url": "https://avatars.githubusercontent.com/u/2495109?v=3",
 *     "repos_url": "https://api.github.com/users/yllieth/repos",
 *     "is_organization": false,
 *     "contribution": 32
 *   }
 * ]
 */
exports.handler = function(event, context, callback) {
  let accessToken = event.requestContext.authorizer.githob;
  let username    = event.pathParameters.username;
  let reponame    = event.pathParameters.reponame;

  getGithubContributors(accessToken, username, reponame)
    .then(contributors => buildOutput(contributors))
    .then(formattedList => done(callback, null, formattedList, 200))
    .catch(error => done(callback, error, null, 500));
};

function getGithubContributors(accessToken, username, reponame) {
  if (debug === true) {
    console.log('=== getGithubContributors ===');
    console.log('inputs: ', JSON.stringify({accessToken, username, reponame}, null, 2));
  }

  return invokeLambdaWith({
    FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-get-repos-contributors',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({
      requestContext: { authorizer: { githob: accessToken }},
      pathParameters: { owner: username, repo: reponame }
    })
  })
}

// ----------------------------------------------------------------------------

function buildOutput(resolvedUsers) {
  return new Promise(resolve => {
    let formattedList = [];

    for(let repo of resolvedUsers) {
      formattedList.push({
        id: repo.id,
        login: repo.login,
        full_name: null,    // not provided by contributor request
        description: null,  // not provided by contributor request
        url: repo.html_url,
        events_url: repo.events_url,
        avatar_url: repo.avatar_url,
        repos_url: repo.repos_url,
        is_organization: repo.type === 'User',
        contributions: repo.contributions
      });
    }

    resolve(formattedList);
  });
}

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

function invokeLambdaWith(params) {
  return new Promise((resolve, reject) => {
    lambda.invoke(params, function(error, data) {
      if (debug) {
        console.log('params (' + params.FunctionName.split(':').pop() + ')', JSON.stringify({params}, null, 2));
        console.log('output (' + params.FunctionName.split(':').pop() + ')', JSON.stringify({error, data}, null, 2));
      }

      let response       = JSON.parse(data.Payload);
      let responseStatus = 500;
      let responseBody   = {};

      try {
        responseBody = JSON.parse(response.body);
        responseStatus = response.statusCode;
      } catch (e) {
        reject(e);
        return;
      }

      if (responseStatus === 200 || responseStatus === 201) {
        resolve(responseBody);
      } else if (responseStatus === 404) {
        reject("Not found");
      }

      return;
    });
  });
}