import json
import httplib

# GET Method
# Github request (See https://developer.github.com/v3/git/refs/#get-a-reference)
# ------------------------------------------------------------------------------
#
# Inputs:
# === HEADERS
# - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
#
# === PATH PARAMETERS : /github/repos/{owner}/{repo}/git/refs/{ref}
# - owner: {String} - Ex: yllieth
# - repo:  {String} - Ex: localehub
# - ref:   {String} - Ex: heads/master : RequiredFormat: Must start with 'heads/'
#
# === QUERY STRING PARAMETERS : None
# === BODY : Not applicable
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
    ref   = event['pathParameters']['ref']
    response = branches_request(github_token, owner, repo, ref)
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

def branches_request(access_token, owner, repo, branch):
    method = "GET"
    endpoint = "api.github.com"
    url = "/repos/" + owner + "/" + repo + "/git/refs/" + branch
    headers = {
        "Authorization": "token " + access_token,   # https://developer.github.com/v3/#oauth2-token-sent-in-a-header
        "Content-Type": "application/json",
        "User-Agent": "Localehub"                   # https://developer.github.com/v3/#user-agent-required
    }

    print(method, endpoint + url, 'token ' + access_token)
    conn = httplib.HTTPSConnection(endpoint)
    conn.request(method, url, None, headers)
    return conn.getresponse()