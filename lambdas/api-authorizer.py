import boto3

client_dynamo = boto3.client('dynamodb')

def lambda_handler(event, context):
    token = event['authorizationToken']
    auth_info = client_dynamo.get_item(TableName='tokens', Key={'token': { 'S': token } }).get('Item')

    if (auth_info):
        print auth_info
        return generatePolicy('user', event['methodArn'], { 'githob': auth_info['github_token']['S'] })
    else:
        print 'no auth'
        raise Exception('Unauthorized')
    
def generatePolicy(principalId, resource, context):
    return {
        'principalId': principalId,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': 'Allow',
                'Resource': resource
            }]
        },
        'context': context
    }