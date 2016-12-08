import boto3
import json
from boto3.dynamodb.conditions import Key
from boto3 import client as boto3_client

# Returns the list of existing projects of connected user
def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    user = json.loads(get_current_user(github_token)).get('body')
    current_user = json.loads(user).get('url')

    response = json.dumps(fetch_projects(current_user), default=json_serializer)

    return {
        "statusCode": 200,
        "body": response,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    }

def json_serializer(obj):
    if isinstance(obj, set):
        return list(obj)
    raise TypeError

# DynamoDB request: SELECT * FROM projects where 'user'=current_user
# Retreive all existing projects from the connected user
#
# @param user {String|Url} - User who creates project. Example: "https://api.github.com/users/yllieth"
def fetch_projects(user):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('projects')
    return table.scan(FilterExpression=Key('user').eq(user)).get('Items')


# Github request: GET /user
# Retreive the connected user
#
# @param access_token {String|Md5Hash} - Github access token. Example: "fcebdb60902a829a61fad9ff702271cab406b37b"
def get_current_user(access_token):
    lambda_client = boto3_client('lambda')
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
