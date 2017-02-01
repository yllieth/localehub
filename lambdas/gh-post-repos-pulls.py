import json
import httplib

# POST Method :
# Github request (See https://developer.github.com/v3/pulls/#create-a-pull-request)
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
# === BODY
# - *title: {String} Name of the pull request
# - *head:  {String} The name of the branch where your changes are implemented - Ex: gh-test-localehub
# - *base:  {String} The name of the branch you want the changes pulled into - Ex: gh-test
# -  body:  {String} The message of the pull request
# -  maintainer_can_modify: {Boolean} Are user contributing on a fork of the repo able to edit/merge the PR
# ------------------------------------------------------------------------------
#
# Output:
# {
#    "id": 1,
#    "url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347",
#    "html_url": "https://github.com/octocat/Hello-World/pull/1347",
#    "diff_url": "https://github.com/octocat/Hello-World/pull/1347.diff",
#    "patch_url": "https://github.com/octocat/Hello-World/pull/1347.patch",
#    "issue_url": "https://api.github.com/repos/octocat/Hello-World/issues/1347",
#    "commits_url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits",
#    "review_comments_url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347/comments",
#    "review_comment_url": "https://api.github.com/repos/octocat/Hello-World/pulls/comments{/number}",
#    "comments_url": "https://api.github.com/repos/octocat/Hello-World/issues/1347/comments",
#    "statuses_url": "https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
#    "number": 1347,
#    "state": "open",
#    "title": "new-feature",
#    "body": "Please pull these awesome changes",
#    "assignee": {
#      "login": "octocat",
#      "id": 1,
#      "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#      "gravatar_id": "",
#      "url": "https://api.github.com/users/octocat",
#      "html_url": "https://github.com/octocat",
#      "followers_url": "https://api.github.com/users/octocat/followers",
#      "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#      "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#      "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#      "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#      "organizations_url": "https://api.github.com/users/octocat/orgs",
#      "repos_url": "https://api.github.com/users/octocat/repos",
#      "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#      "received_events_url": "https://api.github.com/users/octocat/received_events",
#      "type": "User",
#      "site_admin": false
#    },
#    "milestone": {
#      "url": "https://api.github.com/repos/octocat/Hello-World/milestones/1",
#      "html_url": "https://github.com/octocat/Hello-World/milestones/v1.0",
#      "labels_url": "https://api.github.com/repos/octocat/Hello-World/milestones/1/labels",
#      "id": 1002604,
#      "number": 1,
#      "state": "open",
#      "title": "v1.0",
#      "description": "Tracking milestone for version 1.0",
#      "creator": {
#        "login": "octocat",
#        "id": 1,
#        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#        "gravatar_id": "",
#        "url": "https://api.github.com/users/octocat",
#        "html_url": "https://github.com/octocat",
#        "followers_url": "https://api.github.com/users/octocat/followers",
#        "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#        "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#        "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#        "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#        "organizations_url": "https://api.github.com/users/octocat/orgs",
#        "repos_url": "https://api.github.com/users/octocat/repos",
#        "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#        "received_events_url": "https://api.github.com/users/octocat/received_events",
#        "type": "User",
#        "site_admin": false
#      },
#      "open_issues": 4,
#      "closed_issues": 8,
#      "created_at": "2011-04-10T20:09:31Z",
#      "updated_at": "2014-03-03T18:58:10Z",
#      "closed_at": "2013-02-12T13:22:01Z",
#      "due_on": "2012-10-09T23:39:01Z"
#    },
#    "locked": false,
#    "created_at": "2011-01-26T19:01:12Z",
#    "updated_at": "2011-01-26T19:01:12Z",
#    "closed_at": "2011-01-26T19:01:12Z",
#    "merged_at": "2011-01-26T19:01:12Z",
#    "head": {
#      "label": "new-topic",
#      "ref": "new-topic",
#      "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
#      "user": {
#        "login": "octocat",
#        "id": 1,
#        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#        "gravatar_id": "",
#        "url": "https://api.github.com/users/octocat",
#        "html_url": "https://github.com/octocat",
#        "followers_url": "https://api.github.com/users/octocat/followers",
#        "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#        "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#        "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#        "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#        "organizations_url": "https://api.github.com/users/octocat/orgs",
#        "repos_url": "https://api.github.com/users/octocat/repos",
#        "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#        "received_events_url": "https://api.github.com/users/octocat/received_events",
#        "type": "User",
#        "site_admin": false
#      },
#      "repo": {
#        "id": 1296269,
#        "owner": {
#          "login": "octocat",
#          "id": 1,
#          "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#          "gravatar_id": "",
#          "url": "https://api.github.com/users/octocat",
#          "html_url": "https://github.com/octocat",
#          "followers_url": "https://api.github.com/users/octocat/followers",
#          "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#          "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#          "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#          "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#          "organizations_url": "https://api.github.com/users/octocat/orgs",
#          "repos_url": "https://api.github.com/users/octocat/repos",
#          "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#          "received_events_url": "https://api.github.com/users/octocat/received_events",
#          "type": "User",
#          "site_admin": false
#        },
#        "name": "Hello-World",
#        "full_name": "octocat/Hello-World",
#        "description": "This your first repo!",
#        "private": false,
#        "fork": true,
#        "url": "https://api.github.com/repos/octocat/Hello-World",
#        "html_url": "https://github.com/octocat/Hello-World",
#        "archive_url": "http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
#        "assignees_url": "http://api.github.com/repos/octocat/Hello-World/assignees{/user}",
#        "blobs_url": "http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
#        "branches_url": "http://api.github.com/repos/octocat/Hello-World/branches{/branch}",
#        "clone_url": "https://github.com/octocat/Hello-World.git",
#        "collaborators_url": "http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
#        "comments_url": "http://api.github.com/repos/octocat/Hello-World/comments{/number}",
#        "commits_url": "http://api.github.com/repos/octocat/Hello-World/commits{/sha}",
#        "compare_url": "http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
#        "contents_url": "http://api.github.com/repos/octocat/Hello-World/contents/{+path}",
#        "contributors_url": "http://api.github.com/repos/octocat/Hello-World/contributors",
#        "deployments_url": "http://api.github.com/repos/octocat/Hello-World/deployments",
#        "downloads_url": "http://api.github.com/repos/octocat/Hello-World/downloads",
#        "events_url": "http://api.github.com/repos/octocat/Hello-World/events",
#        "forks_url": "http://api.github.com/repos/octocat/Hello-World/forks",
#        "git_commits_url": "http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
#        "git_refs_url": "http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
#        "git_tags_url": "http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
#        "git_url": "git:github.com/octocat/Hello-World.git",
#        "hooks_url": "http://api.github.com/repos/octocat/Hello-World/hooks",
#        "issue_comment_url": "http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
#        "issue_events_url": "http://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
#        "issues_url": "http://api.github.com/repos/octocat/Hello-World/issues{/number}",
#        "keys_url": "http://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
#        "labels_url": "http://api.github.com/repos/octocat/Hello-World/labels{/name}",
#        "languages_url": "http://api.github.com/repos/octocat/Hello-World/languages",
#        "merges_url": "http://api.github.com/repos/octocat/Hello-World/merges",
#        "milestones_url": "http://api.github.com/repos/octocat/Hello-World/milestones{/number}",
#        "mirror_url": "git:git.example.com/octocat/Hello-World",
#        "notifications_url": "http://api.github.com/repos/octocat/Hello-World/notifications{?since, all, participating}",
#        "pulls_url": "http://api.github.com/repos/octocat/Hello-World/pulls{/number}",
#        "releases_url": "http://api.github.com/repos/octocat/Hello-World/releases{/id}",
#        "ssh_url": "git@github.com:octocat/Hello-World.git",
#        "stargazers_url": "http://api.github.com/repos/octocat/Hello-World/stargazers",
#        "statuses_url": "http://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
#        "subscribers_url": "http://api.github.com/repos/octocat/Hello-World/subscribers",
#        "subscription_url": "http://api.github.com/repos/octocat/Hello-World/subscription",
#        "svn_url": "https://svn.github.com/octocat/Hello-World",
#        "tags_url": "http://api.github.com/repos/octocat/Hello-World/tags",
#        "teams_url": "http://api.github.com/repos/octocat/Hello-World/teams",
#        "trees_url": "http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
#        "homepage": "https://github.com",
#        "language": null,
#        "forks_count": 9,
#        "stargazers_count": 80,
#        "watchers_count": 80,
#        "size": 108,
#        "default_branch": "master",
#        "open_issues_count": 0,
#        "has_issues": true,
#        "has_wiki": true,
#        "has_pages": false,
#        "has_downloads": true,
#        "pushed_at": "2011-01-26T19:06:43Z",
#        "created_at": "2011-01-26T19:01:12Z",
#        "updated_at": "2011-01-26T19:14:43Z",
#        "permissions": {
#          "admin": false,
#          "push": false,
#          "pull": true
#        }
#      }
#    },
#    "base": {
#      "label": "master",
#      "ref": "master",
#      "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
#      "user": {
#        "login": "octocat",
#        "id": 1,
#        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#        "gravatar_id": "",
#        "url": "https://api.github.com/users/octocat",
#        "html_url": "https://github.com/octocat",
#        "followers_url": "https://api.github.com/users/octocat/followers",
#        "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#        "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#        "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#        "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#        "organizations_url": "https://api.github.com/users/octocat/orgs",
#        "repos_url": "https://api.github.com/users/octocat/repos",
#        "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#        "received_events_url": "https://api.github.com/users/octocat/received_events",
#        "type": "User",
#        "site_admin": false
#      },
#      "repo": {
#        "id": 1296269,
#        "owner": {
#          "login": "octocat",
#          "id": 1,
#          "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#          "gravatar_id": "",
#          "url": "https://api.github.com/users/octocat",
#          "html_url": "https://github.com/octocat",
#          "followers_url": "https://api.github.com/users/octocat/followers",
#          "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#          "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#          "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#          "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#          "organizations_url": "https://api.github.com/users/octocat/orgs",
#          "repos_url": "https://api.github.com/users/octocat/repos",
#          "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#          "received_events_url": "https://api.github.com/users/octocat/received_events",
#          "type": "User",
#          "site_admin": false
#        },
#        "name": "Hello-World",
#        "full_name": "octocat/Hello-World",
#        "description": "This your first repo!",
#        "private": false,
#        "fork": true,
#        "url": "https://api.github.com/repos/octocat/Hello-World",
#        "html_url": "https://github.com/octocat/Hello-World",
#        "archive_url": "http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
#        "assignees_url": "http://api.github.com/repos/octocat/Hello-World/assignees{/user}",
#        "blobs_url": "http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
#        "branches_url": "http://api.github.com/repos/octocat/Hello-World/branches{/branch}",
#        "clone_url": "https://github.com/octocat/Hello-World.git",
#        "collaborators_url": "http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
#        "comments_url": "http://api.github.com/repos/octocat/Hello-World/comments{/number}",
#        "commits_url": "http://api.github.com/repos/octocat/Hello-World/commits{/sha}",
#        "compare_url": "http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
#        "contents_url": "http://api.github.com/repos/octocat/Hello-World/contents/{+path}",
#        "contributors_url": "http://api.github.com/repos/octocat/Hello-World/contributors",
#        "deployments_url": "http://api.github.com/repos/octocat/Hello-World/deployments",
#        "downloads_url": "http://api.github.com/repos/octocat/Hello-World/downloads",
#        "events_url": "http://api.github.com/repos/octocat/Hello-World/events",
#        "forks_url": "http://api.github.com/repos/octocat/Hello-World/forks",
#        "git_commits_url": "http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
#        "git_refs_url": "http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
#        "git_tags_url": "http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
#        "git_url": "git:github.com/octocat/Hello-World.git",
#        "hooks_url": "http://api.github.com/repos/octocat/Hello-World/hooks",
#        "issue_comment_url": "http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
#        "issue_events_url": "http://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
#        "issues_url": "http://api.github.com/repos/octocat/Hello-World/issues{/number}",
#        "keys_url": "http://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
#        "labels_url": "http://api.github.com/repos/octocat/Hello-World/labels{/name}",
#        "languages_url": "http://api.github.com/repos/octocat/Hello-World/languages",
#        "merges_url": "http://api.github.com/repos/octocat/Hello-World/merges",
#        "milestones_url": "http://api.github.com/repos/octocat/Hello-World/milestones{/number}",
#        "mirror_url": "git:git.example.com/octocat/Hello-World",
#        "notifications_url": "http://api.github.com/repos/octocat/Hello-World/notifications{?since, all, participating}",
#        "pulls_url": "http://api.github.com/repos/octocat/Hello-World/pulls{/number}",
#        "releases_url": "http://api.github.com/repos/octocat/Hello-World/releases{/id}",
#        "ssh_url": "git@github.com:octocat/Hello-World.git",
#        "stargazers_url": "http://api.github.com/repos/octocat/Hello-World/stargazers",
#        "statuses_url": "http://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
#        "subscribers_url": "http://api.github.com/repos/octocat/Hello-World/subscribers",
#        "subscription_url": "http://api.github.com/repos/octocat/Hello-World/subscription",
#        "svn_url": "https://svn.github.com/octocat/Hello-World",
#        "tags_url": "http://api.github.com/repos/octocat/Hello-World/tags",
#        "teams_url": "http://api.github.com/repos/octocat/Hello-World/teams",
#        "trees_url": "http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
#        "homepage": "https://github.com",
#        "language": null,
#        "forks_count": 9,
#        "stargazers_count": 80,
#        "watchers_count": 80,
#        "size": 108,
#        "default_branch": "master",
#        "open_issues_count": 0,
#        "has_issues": true,
#        "has_wiki": true,
#        "has_pages": false,
#        "has_downloads": true,
#        "pushed_at": "2011-01-26T19:06:43Z",
#        "created_at": "2011-01-26T19:01:12Z",
#        "updated_at": "2011-01-26T19:14:43Z",
#        "permissions": {
#          "admin": false,
#          "push": false,
#          "pull": true
#        }
#      }
#    },
#    "_links": {
#      "self": {
#        "href": "https://api.github.com/repos/octocat/Hello-World/pulls/1347"
#      },
#      "html": {
#        "href": "https://github.com/octocat/Hello-World/pull/1347"
#      },
#      "issue": {
#        "href": "https://api.github.com/repos/octocat/Hello-World/issues/1347"
#      },
#      "comments": {
#        "href": "https://api.github.com/repos/octocat/Hello-World/issues/1347/comments"
#      },
#      "review_comments": {
#        "href": "https://api.github.com/repos/octocat/Hello-World/pulls/1347/comments"
#      },
#      "review_comment": {
#        "href": "https://api.github.com/repos/octocat/Hello-World/pulls/comments{/number}"
#      },
#      "commits": {
#        "href": "https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits"
#      },
#      "statuses": {
#        "href": "https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e"
#      }
#    },
#    "user": {
#      "login": "octocat",
#      "id": 1,
#      "avatar_url": "https://github.com/images/error/octocat_happy.gif",
#      "gravatar_id": "",
#      "url": "https://api.github.com/users/octocat",
#      "html_url": "https://github.com/octocat",
#      "followers_url": "https://api.github.com/users/octocat/followers",
#      "following_url": "https://api.github.com/users/octocat/following{/other_user}",
#      "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
#      "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
#      "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
#      "organizations_url": "https://api.github.com/users/octocat/orgs",
#      "repos_url": "https://api.github.com/users/octocat/repos",
#      "events_url": "https://api.github.com/users/octocat/events{/privacy}",
#      "received_events_url": "https://api.github.com/users/octocat/received_events",
#      "type": "User",
#      "site_admin": false
#    }
#  }
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
    url = "/repos/" + owner + "/" + repo + "/pulls"
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
		"title": body['title'],
		"head": body['head'],
		"base": body['base']
	}

	if 'body' in body:
		params['body'] = body['body']

	if 'maintainer_can_modify' in body:
		params['maintainer_can_modify'] = body['maintainer_can_modify']

	return json.dumps(params)