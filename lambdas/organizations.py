from boto3 import client as boto3_client
import json

lambda_client = boto3_client('lambda')

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
    
def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    organizations = get_organizations(github_token)
    
    return {
        "statusCode": 200,
        "body": organizations,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    }
