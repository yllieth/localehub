'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let debug = true;

/**
 * POST Method
 * Wraps 1 call of lambdas: gh-post-repos-pulls
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /projects/:projectId/pull-request
 * === QUERY STRING PARAMETERS : None
 * === BODY : Object
 * - *title: {String} The title of the pull request - Ex: Updating locales (en)
 * - *head:  {String} The name of the branch where your changes are implemented
 * - *base:  {String} The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
 * -  body:  {String} The content of the pull request
 * -  maintainer_can_modify: {Boolean} Indicates whether maintainers can modify the pull request.
 *
 * Output:
 * TODO: give example output
 */
exports.handler = function(event, context, callback) {
  let accessToken = event.requestContext.authorizer.githob;
  let payload = JSON.parse(event.body);

  createPullRequest(accessToken, payload)
    // .then(pullRequest => buildOutput(pullRequest))
    .then(pullRequest => done(callback, null, pullRequest, 200))
    .catch(error => done(callback, error, null, 500));
};

function createPullRequest(accessToken, payload) {
  if (debug === true) {
    console.log('=== createPullRequest ===');
    console.log('inputs: ', JSON.stringify({accessToken, payload}, null, 2));
  }

  let owner = payload.owner;
  delete payload.owner;

  let repo = payload.repo;
  delete payload.repo;

  return invokeLambdaWith({
    FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:gh-post-repos-pulls',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({
      requestContext: { authorizer: { githob: accessToken }},
      pathParameters: { owner, repo },
	  body: JSON.stringify(payload)
    })
  })
}

// ----------------------------------------------------------------------------

function buildOutput(pullRequest) {
  return new Promise(resolve => {
    let formattedPR = [];

    for(let repo of pullRequest) {
      formattedPR.push({
        // mapping of kept properties
      });
    }

    resolve(formattedPR);
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