import json
import httplib

# POST Method : !!! MUST BE AUTHENTICATED WITH 'REPO' SCOPE !!!
# Github request (See https://developer.github.com/v3/git/refs/#create-a-reference)
# ------------------------------------------------------------------------------
#
# Inputs:
# === HEADERS
# - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
#
# === PATH PARAMETERS : /github/repos/{owner}/{repo}/git/refs
# - owner: {String} - Ex: yllieth
# - repo:  {String} - Ex: localehub
# - ref:   {String} - Ex: heads/master : RequiredFormat: Must start with 'heads/'
#
# === QUERY STRING PARAMETERS : None
# === BODY
# - ref: {String} Name of the new branch - Ex: refs/heads/new-branch : RequiredFormat: Must start with 'refs' and contains at least 2 '/'
# - sha: {String} Reference of the commit to branch from - Ex: aa218f56b14c9653891f9e74264a383fa43fefbd
# ------------------------------------------------------------------------------
#
# Output:
# {
#   "ref": "refs/heads/featureA",
#   "url": "https://api.github.com/repos/octocat/Hello-World/git/refs/heads/featureA",
#   "object": {
#     "type": "commit",
#     "sha": "aa218f56b14c9653891f9e74264a383fa43fefbd",
#     "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/aa218f56b14c9653891f9e74264a383fa43fefbd"
#   }
# }
def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    owner = event['pathParameters']['owner']
    repo  = event['pathParameters']['repo']
    body  = json.loads(event['body'])
    response = request(github_token, owner, repo, body)
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

def request(access_token, owner, repo, requestBody):
    method = "POST"
    endpoint = "api.github.com"
    url = "/repos/" + owner + "/" + repo + "/git/refs"
    headers = {
        "Authorization": "token " + access_token,   # https://developer.github.com/v3/#oauth2-token-sent-in-a-header
        "Content-Type": "application/json",
        "User-Agent": "Localehub"                   # https://developer.github.com/v3/#user-agent-required
    }
    params = json.dumps({
        "ref": requestBody['ref'],
        "sha": requestBody['sha']
    })

    print(method, endpoint + url, 'token ' + access_token)
    print('payload:', params)
    conn = httplib.HTTPSConnection(endpoint)
    conn.request(method, url, params, headers)
    return conn.getresponse()