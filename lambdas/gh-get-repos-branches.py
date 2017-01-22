import json
import httplib
import urllib

# See https://developer.github.com/v3/repos/branches/#list-branches
# A complete github branch looks like:
# {
#   "name": "master",
#   "commit": {
#     "sha": "9e5d54b867f5b3a522209906fffb1ecc31ab0a6d",
#     "url": "https://api.github.com/repos/yllieth/localehub/commits/9e5d54b867f5b3a522209906fffb1ecc31ab0a6d"
#   }
# }
def branches_request(access_token, owner, repo):
    method = "GET"
    endpoint = "api.github.com"
    url = "/repos/" + owner + "/" + repo + "/branches"
    headers = {
        "Authorization": "token " + access_token,   # https://developer.github.com/v3/#oauth2-token-sent-in-a-header
        "Content-Type": "application/json",
        "User-Agent": "Localehub"                   # https://developer.github.com/v3/#user-agent-required
    }

    print(method, endpoint + url, 'token ' + access_token)
    conn = httplib.HTTPSConnection(endpoint)
    conn.request(method, url, None, headers)
    return conn.getresponse()

def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    owner = event['pathParameters']['owner']
    repo  = event['pathParameters']['repo']
    response = branches_request(github_token, owner, repo)
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