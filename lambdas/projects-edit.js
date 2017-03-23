'use strict';

let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });
let debug = true;

/**
 * PATCH Method
 * Wraps 1 call to dynamoDB
 * -----------------------------------------------------------------------------
 *
 * Inputs:
 * === HEADERS
 * - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
 *
 * === PATH PARAMETERS : /projects/:projectId
 * === QUERY STRING PARAMETERS : None
 * === BODY : Object
 * - operation: {String}         The name of the processed operation (append-pendingChanges, set-pendingChanges, ...)
 * - update:    {LocaleUpdate[]} An array of updates to save
 *   - languageCode: {String} - Ex: "en", "zh-TW", ...
 *   - branch:       {String} The name of the branch where the change occurs - Ex: master
 *   - key:          {String} The complete path of the updated locale - Ex: errors.not_found
 *   - values:
 *     - newString:  {String} The new value of the key
 *     - oldString:  {String} The old value of the key
 *
 * Output: Object
 * {
 *   id: "0cb671ee-3c0c-38fc-ba5f-b58d24d30efa",
 *   name: "localehub",
 *   availableBranches: ["gh-test-localehub","gh-test","master","tp-issue-20","tp-new-project-dialog","tp-preview-dialog","tp-simple-github-authentication"],
 *   lastActiveBranch: "master",
 *   i18nFiles: [
 *     {languageCode: "ar-SY", count: 43, path: "package.json", format: "json", repo: "yllieth/localehub", branch: "master"}
 *   ],
 *   repository: {
 *     id: 69961239,
 *     name: "localehub",
 *     fullName: "yllieth/localehub",
 *     description: "[WebApp] Add/update versionned I18N support to an existing application",
 *     owner: {
 *       id: 1174557,
 *       login: "yllieth",
 *       full_name: null,
 *       description: null,
 *       url: "https://github.com/yllieth",
 *       events_url: "https://api.github.com/users/yllieth/events{/privacy}",
 *       avatar_url: "https://avatars.githubusercontent.com/u/1174557?v=3",
 *       repos_url: "https://api.github.com/users/yllieth/repos",
 *       is_organization: false
 *     },
 *     private: false,
 *     fork: false
 *   },
 *   pendingChanges: [
 *     {
 *       languageCode: "fr",
 *       branch: "master",
 *       key: "errors.not_found",
 *       values: {
 *         newString: "Page introuvable",
 *         oldString: "Page introubalbe"
 *       }
 *     }
 *   ],
 *   createdBy: {
 *     id: 1174557,
 *     login: "yllieth",
 *     full_name: "Sylvain RAGOT",
 *     description: "Frontend developer, passionated about web design, AngularJS lover. Having a beautiful life is easy: a motivating project, a whiteboard, and a laptop",
 *     url: "https://github.com/yllieth",
 *     events_url: "https://api.github.com/users/yllieth/events{/privacy}",
 *     avatar_url: "https://avatars.githubusercontent.com/u/1174557?v=3",
 *     repos_url: "https://api.github.com/users/yllieth/repos",
 *     is_organization: false
 *   }
 * }
 */
exports.handler = function(event, context, callback) {
	let projectId = event.pathParameters.id;

	buildQuery(projectId, JSON.parse(event.body))
		.then(query => updateProject(query))
		.then(project => done(callback, null, {project}, 200))
		.catch(error => done(callback, error, null, 500));
};

function buildQuery(projectId, body) {
	if (debug === true) {
		console.log('=== buildQuery ===');
		console.log('inputs:', JSON.stringify({projectId, body}, null, 2));
	}

	return new Promise((resolve, reject) => {
		let operation = body.operation;
		let update = body.update;

		if (operation === 'set-pendingChanges') {
			let query = {
				TableName: 'projects',
				Key: {id: projectId},
				ReturnValues: 'ALL_NEW',
				UpdateExpression: 'set pendingChanges = :pendingChanges',
				ExpressionAttributeValues: { ':pendingChanges': update }
			};

			if (debug === true) {
				console.log('output:', JSON.stringify({query}, null, 2));
			}

			resolve(query);
		} else if (operation === 'append-pendingChanges') {
			return findProject(projectId)
				.then(project => mergeChanges(update, project.pendingChanges))
				.then(changes => {
					let query = {
						TableName: 'projects',
						Key: {id: projectId},
						ReturnValues: 'ALL_NEW',
						UpdateExpression: 'set pendingChanges = :pendingChanges',
						ExpressionAttributeValues: { ':pendingChanges': changes }
					};

					if (debug === true) {
						console.log('output:', JSON.stringify({query}, null, 2));
					}

					resolve(query);
				});
		}
	});
}

function findProject(projectId) {
	if (debug === true) {
		console.log('=== findProject ===');
		console.log('inputs:', JSON.stringify({projectId}, null, 2));
	}

	return new Promise((resolve, reject) => {
		dynamo.get({TableName: 'projects', Key: { id: projectId }}, function(error, data) {
			if (debug === true) {
				console.log('output:', JSON.stringify({error, data}, null, 2));
			}

			if (error) reject(error); else resolve(data.Item);
		});
	});
}

function mergeChanges(pendingChanges, savedChanges) {
	if (debug === true) {
		console.log('=== mergeChanges ===');
		console.log('inputs:', JSON.stringify({pendingChanges, savedChanges}, null, 2));
	}

	return new Promise(resolve => {
		for (let change of pendingChanges) {
			let sequence = false;
			for (let savedChange of savedChanges) {
				sequence = isSequence(savedChange, change);
				if (sequence === true) {
					savedChange.value.newString = change.value.newString;
				}
			}

			if (sequence === false) {
				savedChanges.push(change);
			}
		}

		if (debug === true) {
			console.log('output:', JSON.stringify({changes: savedChanges}, null, 2));
		}

		resolve(savedChanges);
	});
}

function updateProject(query) {
	if (debug === true) {
		console.log('=== updateProject ===');
		console.log('inputs:', JSON.stringify({query}, null, 2));
	}

	return new Promise((resolve, reject) => {
		dynamo.update(query, function(error, data) {
			if (debug === true) {
				console.log('output:', JSON.stringify({error, data}, null, 2));
			}

			if (error) reject(error); else resolve(data.Attributes);
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

function isSequence(update1, update2) {
	if (debug === true) {
		console.log('=== isSequence ===');
		console.log('inputs:', JSON.stringify({update1, update2}, null, 2));
	}

	let sequence = update1.branch === update2.branch
		&& update1.key === update2.key
		&& update1.languageCode === update2.languageCode
		&& update1.value.newString === update2.value.oldString;

	if (debug === true) {
		console.log('output:', JSON.stringify({sequence}, null, 2));
	}

	return sequence;
}