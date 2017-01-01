import boto3
import json
import decimal  # used for JSON serialization
from boto3.dynamodb.conditions import Key
from boto3 import client as boto3_client

# Returns the list of existing projects of connected user
# A Project is defined by the following fields:
# - id                (string)    - Ex: 57a889ab510b2ce22daeee41fb8d0872
# - name              (string)    - The project's name. Initialized with github repository name but could be different
# - availableBranches (string[])  - List of available branches. Ex: ['master', 'tp-branch1', 'pu-20161002']
# - lastActiveBranch  (string)    - The name of the last branch used within the app. Ex: 'master'
# - user              (url)       - The github url of the project's creator. Ex: https://api.github.com/users/yllieth
# - owner             (url)       - The github url of the repository's creator. Ex: https://api.github.com/orgs/PredicSis
# - i18nFiles         (object)    - contains info on translation files (count, path, format)
def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    user = json.loads(get_current_user(github_token)).get('body')
    current_user = json.loads(user).get('url')

    response = json.dumps(fetch_projects(current_user), cls=CustomJSONEncoder)

    return {
        "statusCode": 200,
        "body": response,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    }

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


class CustomJSONEncoder(json.JSONEncoder):
    map_encoding = {
        set: list,
        decimal.Decimal: float,
        # ma_class: ma_transformation
        # ...
    }
    def default(self, obj):
        if type(obj) in self.map_encoding.keys():
            return self.map_encoding[type(obj)](obj)
        return json.JSONEncoder.default(self, obj)