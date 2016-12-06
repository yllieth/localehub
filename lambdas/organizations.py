from boto3 import client as boto3_client
import json

lambda_client = boto3_client('lambda')

def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    organizations = json.loads(get_organizations(github_token))
    user = json.loads(get_current_user(github_token))
    output = build_output(organizations["body"], user["body"])

    return {
        "statusCode": 200,
        "body": json.dumps(output),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    }

# Github request
def get_organizations(access_token):
    payload = {"requestContext": {"authorizer": {"githob": access_token}}}
    invoke_response = lambda_client.invoke(
        FunctionName="arn:aws:lambda:eu-central-1:673077269136:function:gh-get-user-orgs",
        InvocationType='RequestResponse',
        Payload=json.dumps(payload)
    )

    if(invoke_response.has_key('Payload') and invoke_response.has_key('StatusCode')):
        response = invoke_response.get('Payload').read()
        status = invoke_response.get('StatusCode')
    else:
        response = {}
        status = 500

    return response

# Github request
def get_current_user(access_token):
    payload = {"requestContext": {"authorizer": {"githob": access_token}}}
    invoke_response = lambda_client.invoke(
        FunctionName="arn:aws:lambda:eu-central-1:673077269136:function:gh-get-user",
        InvocationType='RequestResponse',
        Payload=json.dumps(payload)
    )

    if(invoke_response.has_key('Payload') and invoke_response.has_key('StatusCode')):
        response = invoke_response.get('Payload').read()
        status = invoke_response.get('StatusCode')
    else:
        response = {}
        status = 500

    return response

# Normaize github responses (user and organization) to keep properties in common
# A User/Organization is defined by the following fields:
# - login           (string) - Ex: yllieth
# - description     (string) - Organization's description or User fullname
# - id              (number) - Github internal identifier
# - url             (url)    - Ex: https://api.github.com/users/yllieth
# - events_url      (url)    - Ex: https://api.github.com/users/yllieth/events{/privacy}
# - avatar_url      (url)    - Ex: https://avatars.githubusercontent.com/u/1174557?v=3
# - repos_url       (url)    - Ex: https://api.github.com/users/yllieth/repos
# - is_organization (boolean)
def build_output(organizations, current_user):
    orgs = json.loads(organizations)
    user = json.loads(current_user)

    truncated_user = {
        "login": user["login"],
        "description": user["name"],
        "id": user["id"],
        "url": user["url"],
        "events_url": user["events_url"],
        "avatar_url": user["avatar_url"],
        "repos_url": user["repos_url"],
        "is_organization": False
    }

    for org in orgs:
        del org["issues_url"]
        del org["members_url"]
        del org["public_members_url"]
        del org["hooks_url"]
        org["is_organization"] = True

    orgs.insert(0, truncated_user)
    return orgs
