'use strict';

let AWS = require('aws-sdk');
let lambda = new AWS.Lambda({ region: 'eu-central-1' });
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });
let debug = true;

/**
 * POST Method
 * Wraps 1 call of lambdas: current-user
 * Wraps 1 call of dynamoDB: INSERT <payload> INTO 'projects'
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /projects
 * === QUERY STRING PARAMETERS : None
 * === BODY : Object
 * - name:              {String}   The name of the github repository - Ex: localehub
 * - availableBranches: {String[]} An array of branches on this repo,
 * - lastActiveBranch:  {String}   The name of the branch from where the user defined supported languages
 * - repository: 		{Object}   The simplified version of the repo the user creates the project from
 * - i18nFiles:         {Object[]} An array of supported languages
 *   - languageCode: {String} - Ex: "en", "zh-TW", ...
 *   - count:        {Number} The number of i18n string in the file
 *   - path:         {String} The path of the file - Ex: "locales/en.json"
 *   - format:       {String} The format of the file. For now, only "json" is supported
 *   - repo:         {String} The fullname of the repository - Ex: "yllieth/localehub"
 *   - branch:       {String} The name of the branch to read the file on
 *
 * Output: Object
 * {
 * 	 id: "0cb671ee-3c0c-38fc-ba5f-b58d24d30efa",
 * 	 name: "localehub",
 * 	 availableBranches: ["gh-test-localehub","gh-test","master","tp-issue-20","tp-new-project-dialog","tp-preview-dialog","tp-simple-github-authentication"],
 * 	 lastActiveBranch: "master",
 * 	 i18nFiles: [
 * 	   {languageCode: "ar-SY", count: 43, path: "package.json", format: "json", repo: "yllieth/localehub", branch: "master"}
 * 	 ],
 * 	 repository: {
 * 	   id: 69961239,
 * 	   name: "localehub",
 * 	   fullName: "yllieth/localehub",
 * 	   description: "[WebApp] Add/update versionned I18N support to an existing application",
 * 	   owner: {
 * 	     id: 1174557,
 * 	     login: "yllieth",
 * 	     full_name: null,
 * 	     description: null,
 * 	     url: "https://github.com/yllieth",
 * 	     events_url: "https://api.github.com/users/yllieth/events{/privacy}",
 * 	     avatar_url: "https://avatars.githubusercontent.com/u/1174557?v=3",
 * 	     repos_url: "https://api.github.com/users/yllieth/repos",
 * 	     is_organization: false
 * 	   },
 * 	   private: false,
 * 	   fork: false
 * 	 },
 * 	 pendingChanges: [],
 * 	 createdBy: {
 * 	   id: 1174557,
 * 	   login: "yllieth",
 * 	   full_name: "Sylvain RAGOT",
 * 	   description: "Frontend developer, passionated about web design, AngularJS lover. Having a beautiful life is easy: a motivating project, a whiteboard, and a laptop",
 * 	   url: "https://github.com/yllieth",
 * 	   events_url: "https://api.github.com/users/yllieth/events{/privacy}",
 * 	   avatar_url: "https://avatars.githubusercontent.com/u/1174557?v=3",
 * 	   repos_url: "https://api.github.com/users/yllieth/repos",
 * 	   is_organization: false
 * 	 }
 * }
 */
exports.handler = function(event, context, callback) {
	let accessToken = event.requestContext.authorizer.githob;

	getCurrentUser(accessToken)
		.then(user => saveProject(event.body, user))
		.then(project => done(callback, null, project, 201))
		.catch(error => done(callback, error, null, 500));
};

function getCurrentUser(accessToken) {
	if (debug === true) {
		console.log('=== getCurrentUser ===');
		console.log('inputs:', JSON.stringify({accessToken}, null, 2));
	}

	return invokeLambdaWith({
		FunctionName: 'arn:aws:lambda:eu-central-1:673077269136:function:current-user',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: JSON.stringify({requestContext: { authorizer: { githob: accessToken }}})
	});
}

function saveProject(body, currentUser) {
	if (debug === true) {
		console.log('=== saveProject ===');
		console.log('inputs:', JSON.stringify({body, currentUser}, null, 2));
	}

	return new Promise((resolve, reject) => {
		let project = JSON.parse(body);

		project.id = generateUUID();
		project.pendingChanges = [];
		project.createdBy = currentUser;

		let params = {
			TableName: 'projects',
			Item: project
		};

		dynamo.put(params, function(error, data) {
			if (debug === true) {
				console.log('output:', JSON.stringify({error, data}, null, 2));
			}

			if (error) { reject(error); }
			else { resolve(project); }
		});
	});
}

// ----------------------------------------------------------------------------

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

function generateUUID() {
	let d = new Date().getTime();
	let uuid = 'xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

	return uuid;
}