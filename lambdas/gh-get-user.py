import json
import httplib

def user_request(access_token):
    method = "GET"
    endpoint = "api.github.com"
    url = "/user"
    headers = {
        "Authorization": "token " + access_token,   # https://developer.github.com/v3/#oauth2-token-sent-in-a-header
        "Content-Type": "application/json",
        "User-Agent": "Localehub"                   # https://developer.github.com/v3/#user-agent-required
    }

    conn = httplib.HTTPSConnection(endpoint)
    conn.request(method, url, None, headers)
    return conn.getresponse()

def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    response = user_request(github_token)
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