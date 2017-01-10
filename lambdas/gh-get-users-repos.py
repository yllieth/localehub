import json
import httplib

# See https://developer.github.com/v3/repos/#list-user-repositories
# A github repository object look like:
# {
#   "id": 41301239,
#   "name": "angular-http-status",
#   "full_name": "yllieth/angular-http-status",
#   "owner": {
#     "login": "yllieth",
#     "id": 1174557,
#     "avatar_url": "https://avatars.githubusercontent.com/u/1174557?v=3",
#     "gravatar_id": "",
#     "url": "https://api.github.com/users/yllieth",
#     "html_url": "https://github.com/yllieth",
#     "followers_url": "https://api.github.com/users/yllieth/followers",
#     "following_url": "https://api.github.com/users/yllieth/following{/other_user}",
#     "gists_url": "https://api.github.com/users/yllieth/gists{/gist_id}",
#     "starred_url": "https://api.github.com/users/yllieth/starred{/owner}{/repo}",
#     "subscriptions_url": "https://api.github.com/users/yllieth/subscriptions",
#     "organizations_url": "https://api.github.com/users/yllieth/orgs",
#     "repos_url": "https://api.github.com/users/yllieth/repos",
#     "events_url": "https://api.github.com/users/yllieth/events{/privacy}",
#     "received_events_url": "https://api.github.com/users/yllieth/received_events",
#     "type": "User",
#     "site_admin": false
#   },
#   "private": false,
#   "html_url": "https://github.com/yllieth/angular-http-status",
#   "description": "[Lib] Angular constant for http status codes",
#   "fork": false,
#   "url": "https://api.github.com/repos/yllieth/angular-http-status",
#   "forks_url": "https://api.github.com/repos/yllieth/angular-http-status/forks",
#   "keys_url": "https://api.github.com/repos/yllieth/angular-http-status/keys{/key_id}",
#   "collaborators_url": "https://api.github.com/repos/yllieth/angular-http-status/collaborators{/collaborator}",
#   "teams_url": "https://api.github.com/repos/yllieth/angular-http-status/teams",
#   "hooks_url": "https://api.github.com/repos/yllieth/angular-http-status/hooks",
#   "issue_events_url": "https://api.github.com/repos/yllieth/angular-http-status/issues/events{/number}",
#   "events_url": "https://api.github.com/repos/yllieth/angular-http-status/events",
#   "assignees_url": "https://api.github.com/repos/yllieth/angular-http-status/assignees{/user}",
#   "branches_url": "https://api.github.com/repos/yllieth/angular-http-status/branches{/branch}",
#   "tags_url": "https://api.github.com/repos/yllieth/angular-http-status/tags",
#   "blobs_url": "https://api.github.com/repos/yllieth/angular-http-status/git/blobs{/sha}",
#   "git_tags_url": "https://api.github.com/repos/yllieth/angular-http-status/git/tags{/sha}",
#   "git_refs_url": "https://api.github.com/repos/yllieth/angular-http-status/git/refs{/sha}",
#   "trees_url": "https://api.github.com/repos/yllieth/angular-http-status/git/trees{/sha}",
#   "statuses_url": "https://api.github.com/repos/yllieth/angular-http-status/statuses/{sha}",
#   "languages_url": "https://api.github.com/repos/yllieth/angular-http-status/languages",
#   "stargazers_url": "https://api.github.com/repos/yllieth/angular-http-status/stargazers",
#   "contributors_url": "https://api.github.com/repos/yllieth/angular-http-status/contributors",
#   "subscribers_url": "https://api.github.com/repos/yllieth/angular-http-status/subscribers",
#   "subscription_url": "https://api.github.com/repos/yllieth/angular-http-status/subscription",
#   "commits_url": "https://api.github.com/repos/yllieth/angular-http-status/commits{/sha}",
#   "git_commits_url": "https://api.github.com/repos/yllieth/angular-http-status/git/commits{/sha}",
#   "comments_url": "https://api.github.com/repos/yllieth/angular-http-status/comments{/number}",
#   "issue_comment_url": "https://api.github.com/repos/yllieth/angular-http-status/issues/comments{/number}",
#   "contents_url": "https://api.github.com/repos/yllieth/angular-http-status/contents/{+path}",
#   "compare_url": "https://api.github.com/repos/yllieth/angular-http-status/compare/{base}...{head}",
#   "merges_url": "https://api.github.com/repos/yllieth/angular-http-status/merges",
#   "archive_url": "https://api.github.com/repos/yllieth/angular-http-status/{archive_format}{/ref}",
#   "downloads_url": "https://api.github.com/repos/yllieth/angular-http-status/downloads",
#   "issues_url": "https://api.github.com/repos/yllieth/angular-http-status/issues{/number}",
#   "pulls_url": "https://api.github.com/repos/yllieth/angular-http-status/pulls{/number}",
#   "milestones_url": "https://api.github.com/repos/yllieth/angular-http-status/milestones{/number}",
#   "notifications_url": "https://api.github.com/repos/yllieth/angular-http-status/notifications{?since,all,participating}",
#   "labels_url": "https://api.github.com/repos/yllieth/angular-http-status/labels{/name}",
#   "releases_url": "https://api.github.com/repos/yllieth/angular-http-status/releases{/id}",
#   "deployments_url": "https://api.github.com/repos/yllieth/angular-http-status/deployments",
#   "created_at": "2015-08-24T12:17:02Z",
#   "updated_at": "2016-10-13T14:26:46Z",
#   "pushed_at": "2015-09-08T17:28:38Z",
#   "git_url": "git://github.com/yllieth/angular-http-status.git",
#   "ssh_url": "git@github.com:yllieth/angular-http-status.git",
#   "clone_url": "https://github.com/yllieth/angular-http-status.git",
#   "svn_url": "https://github.com/yllieth/angular-http-status",
#   "homepage": "http://yllieth.github.io/angular-http-status/app/index.html",
#   "size": 180,
#   "stargazers_count": 2,
#   "watchers_count": 2,
#   "language": "HTML",
#   "has_issues": true,
#   "has_downloads": true,
#   "has_wiki": true,
#   "has_pages": true,
#   "forks_count": 1,
#   "mirror_url": null,
#   "open_issues_count": 0,
#   "forks": 1,
#   "open_issues": 0,
#   "watchers": 2,
#   "default_branch": "master",
#   "permissions": {
#     "admin": true,
#     "push": true,
#     "pull": true
#   }
# }
def repositories_request(access_token, username):
    method = "GET"
    endpoint = "api.github.com"
    url = "/users/" + username + "/repos"
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
    github_username = event['pathParameters']['username']
    response = repositories_request(github_token, github_username)
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