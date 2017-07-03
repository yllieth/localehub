import json
import httplib
import urllib

# GET Method :
# Github request (https://developer.github.com/v3/repos/#list-contributors)
# ------------------------------------------------------------------------------
#
# Inputs:
# === HEADERS
# - Authorization: {String: [a-f0-9]{8} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{4} - [a-f0-9]{12}}
#
# === PATH PARAMETERS : /github/repos/{owner}/{repo}/git/refs
# - owner: {String} - Ex: yllieth
# - repo:  {String} - Ex: localehub
#
# === QUERY STRING PARAMETERS : None
# === BODY : Not applicable
# ------------------------------------------------------------------------------
#
# Output: Array of
# {
#  "login": "octocat",
#  "id": 1,
#  "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#  "gravatar_id": "",
#  "url": "https://api.github.com/users/octocat",
#  "html_url": "https://github.com/octocat",
#  "followers_url": "https://api.github.com/users/octocat/followers",
#  "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#  "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#  "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#  "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#  "organizations_url": "https://api.github.com/users/octocat/orgs",
#  "repos_url": "https://api.github.com/users/octocat/repos",
#  "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#  "received_events_url": "https://api.github.com/users/octocat/received_events",
#  "type": "User",
#  "site_admin": false,
#  "contributions": 32
#}
def contributors_request(access_token, owner, repo):
    method = "GET"
    endpoint = "api.github.com"
    url = "/repos/" + owner + "/" + repo + "/contributors"
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
    response = contributors_request(github_token, owner, repo)
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