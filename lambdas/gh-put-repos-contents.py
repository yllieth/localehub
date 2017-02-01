import json
import httplib

# PUT Method
# Github request (See https://developer.github.com/v3/repos/contents/#update-a-file)
# ------------------------------------------------------------------------------
#
# Inputs:
# === HEADERS
# - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
#
# === PATH PARAMETERS : /github/repos/{owner}/{repo}/content/{path}
# - owner: {String} - Ex: yllieth
# - repo:  {String} - Ex: localehub
# - path:  {String} - Ex: assets%2Ftest%2Fen.json : RequiredFormat: Must be URL encoded (convert / into %2F)
#
# === QUERY STRING PARAMETERS : None
# === BODY :
# - *message: {String} The commit message
# - *content: {String} The updated file content - RequiredFormat: base64 encoded
# - *sha:     {String} The blob SHA of the file being replaced
# -  branch:  {String} Default: master
# -  committer: {Object} - Ex: {name: "Sylvain RAGOT", email: "sylvnimes@hotmail.com"}
# -  author:    {Object} - Ex: {name: "Sylvain RAGOT", email: "sylvnimes@hotmail.com"}
# ------------------------------------------------------------------------------
#
# Output:
# {
#   "content": {
#     "name": "hello.txt",
#     "path": "notes/hello.txt",
#     "sha": "95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
#     "size": 9,
#     "url": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
#     "html_url": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt",
#     "git_url": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
#     "download_url": "https://raw.githubusercontent.com/octocat/HelloWorld/master/notes/hello.txt",
#     "type": "file",
#     "_links": {
#       "self": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
#       "git": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
#       "html": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt"
#     }
#   },
#   "commit": {
#     "sha": "7638417db6d59f3c431d3e1f261cc637155684cd",
#     "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd",
#     "html_url": "https://github.com/octocat/Hello-World/git/commit/7638417db6d59f3c431d3e1f261cc637155684cd",
#     "author": {
#       "date": "2014-11-07T22:01:45Z",
#       "name": "Scott Chacon",
#       "email": "schacon@gmail.com"
#     },
#     "committer": {
#       "date": "2014-11-07T22:01:45Z",
#       "name": "Scott Chacon",
#       "email": "schacon@gmail.com"
#     },
#     "message": "my commit message",
#     "tree": {
#       "url": "https://api.github.com/repos/octocat/Hello-World/git/trees/691272480426f78a0138979dd3ce63b77f706feb",
#       "sha": "691272480426f78a0138979dd3ce63b77f706feb"
#     },
#     "parents": [
#       {
#         "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/1acc419d4d6a9ce985db7be48c6349a0475975b5",
#         "html_url": "https://github.com/octocat/Hello-World/git/commit/1acc419d4d6a9ce985db7be48c6349a0475975b5",
#         "sha": "1acc419d4d6a9ce985db7be48c6349a0475975b5"
#       }
#     ]
#   }
# }
def lambda_handler(event, context):
	github_token = event['requestContext']['authorizer']['githob']
	owner = event['pathParameters']['owner']
	repo  = event['pathParameters']['repo']
	path  = event['pathParameters']['path']
	#print(type(event['body']), event['body'])
	body  = json.loads(event['body'])
	response = request(github_token, owner, repo, path, body)
	status = response.status
	data = json.loads(json.dumps(response.read()))
	#print(response.status, response.reason) # 200 OK
	#print(response.read())

	return {
		"statusCode": status,
		"body": data,
		"headers": {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		}
	}

def request(access_token, owner, repo, path, requestBody):
	method = "PUT"
	endpoint = "api.github.com"
	url = "/repos/" + owner + "/" + repo + "/contents/" + path
	headers = {
		"Authorization": "token " + access_token,   # https://developer.github.com/v3/#oauth2-token-sent-in-a-header
		"Content-Type": "application/json",
		"User-Agent": "Localehub"                   # https://developer.github.com/v3/#user-agent-required
	}
	params = build_payload(requestBody)

	print(method, endpoint + url, 'token ' + access_token)
	print('payload:', params)
	conn = httplib.HTTPSConnection(endpoint)
	conn.request(method, url, params, headers)
	return conn.getresponse()

def build_payload(body):
	params = {
		"message": body['message'],
		"content": body['content'],
		"sha": body['sha']
	}

	if 'branch' in body:
		params['branch'] = body['branch']

	if 'committer' in body:
	    committer = json.loads(body['committer'])

	    if 'name' in committer and 'email' in committer:
		params['committer'] = {
			"name": committer['name'],
			"email": committer['email']
		}

	if 'author' in body:
	    author = json.loads(body['author'])

	    if 'name' in author and 'email' in author:
		params['author'] = {
			"name": author['name'],
			"email": author['email']
		}

	return json.dumps(params)