from __future__ import print_function

import boto3
import json
import httplib
import uuid
import os

client_id = os.environ['client_id']
client_secret = os.environ['client_secret']
redirect_url = os.environ['redirect_url']

client_dynamo = boto3.client('dynamodb')
    
def save_token(token, github_token):
  response = client_dynamo.put_item(
    TableName='tokens',
    Item={
        'token': { 'S': token },
        'github_token': { 'S': github_token }
    }
  )

def get_github_token(code, state):
    data= {
        'client_id': client_id,
        'client_secret': client_secret,
        'state': state,
        'redirect_uri': redirect_url,
        'code': code
    }
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    conn = httplib.HTTPSConnection("github.com")
    conn.request("POST", "/login/oauth/access_token", json.dumps(data), headers)
    response = conn.getresponse()
    data = json.loads(response.read())
    print(data)
    if data.get('error'):
        raise Exception(data.get('error'))
    else:
        return data['access_token']

def lambda_handler(event, context):
  github_token = get_github_token(event['code'], event['state'])
  token = str(uuid.uuid1())
  save_token(token, github_token)
  return { 'token': token }