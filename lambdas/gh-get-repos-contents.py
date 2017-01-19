import json
import httplib
import urllib

# See https://developer.github.com/v3/repos/contents/#get-contents
# A complete github contents object for a file looks like:
# {
#   "name": "README.md",
#   "path": "README.md",
#   "sha": "3ce62b918700bfaee7cb05a9be111be427cbeb0b",
#   "size": 2877,
#   "url": "https://api.github.com/repos/yllieth/localehub/contents/README.md?ref=master",
#   "html_url": "https://github.com/yllieth/localehub/blob/master/README.md",
#   "git_url": "https://api.github.com/repos/yllieth/localehub/git/blobs/3ce62b918700bfaee7cb05a9be111be427cbeb0b",
#   "download_url": "https://raw.githubusercontent.com/yllieth/localehub/master/README.md",
#   "type": "file",
#   "content": "IyBMb2NhbGVodWIKCj4gVGhpcyBhcHBsaWNhdGlvbiBpcyBkZWRpY2F0ZWQg\nZm9yIG5vbi1kZXZlbG9wZXIgcGVvcGxlIHdobyBhcmUgaW4gY2hhcmdlIG9m\nIGFkZGluZy91cGRhdGluZyBJMThOIChJbnRlcm5hdGlvbmFsaXphdGlvbikg\nc3VwcG9ydCB0byBhbiBleGlzdGluZyBhcHBsaWNhdGlvbi4KPgo+ICoqUGFp\nbiAjMSoqOiBOb24tZGV2ZWxvcGVyIHBlb3BsZSBhcmVuJ3QgY29tZm9ydGFi\nbGUgd2l0aCBlZGl0aW5nIGNvZGViYXNlIGRpcmVjdGx5IG9uIGdpdGh1YiBv\nciB3aXRoaW4gYW55IHRvb2wgb3IgSURFIHRoYXQgY2FuIGFjY2VzcyBwcm9k\ndWN0aW9uIGNvZGUgLi4uIGFuZCB0aGV5IGFyZSByaWdodCEhCj4KPiAqKlBh\naW4gIzIqKjogRXhpc3RpbmcgdG9vbCB3aGljaCBwcm92aWRlIGFuIGludGVy\nZmFjZSB0byBlZGl0IEkxOE4gc3RyaW5ncyBkb2Vzbid0IHN1cHBvcnQgdGhl\nIGNvbmNlcHQgb2YgYnJhbmNoLiBBcyBhIHJlc3VsdCwgd2hlbiBwZW9wbGUg\nZnJvbSB0aGUgbWFya2V0aW5nIHRlYW0gZWRpdHMgSTE4TiBzdHJpbmdzLCBh\nbiBvdGhlciBkZXZlbG9wZXIgbWF5IGhhdmUgcHVzaGVkIGEgbmV3IHBpZWNl\nIG9mIGNvZGUgd2hpY2ggb3ZlcnJpZGVzIHRoZXNlIGVkaXRpb25zLgoKKipU\nYWJsZSBvZiBjb250ZW50KioKLSBbRmVhdHVyZXMgc3BlY2lmaWNhdGlvbl0o\nI2ZlYXR1cmVzLXNwZWNpZmljYXRpb24pCiAgLSBbdjEuMF0oI212cC0tLXYx\nMCkKICAtIFt2MS4xXSgjYWRkaXRpb25hbC1jb29sLWZlYXR1cmVzLS0tdjEx\nKQotIFtNb2NrdXBzXSgjbW9ja3VwcykKICAtIFtMb2dpbl0oI2xvZ2luKQog\nIC0gW1Byb2plY3RzIGxpc3RdKCNwcm9qZWN0cy1saXN0KQogIC0gW1N0cmlu\nZyBlZGl0aW9uXSgjc3RyaW5nLWVkaXRpb24pCiAgLSBbU3RyaW5nIGFkZGl0\naW9uXSgjc3RyaW5nLWFkZGl0aW9uKQotIFtQcm9qZWN0IEluc3RhbGxhdGlv\nbl0oI3Byb2plY3QtaW5zdGFsbGF0aW9uKQoKIyMgRmVhdHVyZXMgc3BlY2lm\naWNhdGlvbgoKIyMjIE1WUCAtIHYxLjAKLSA6d2hpdGVfY2hlY2tfbWFyazog\nYERPTkVgIExvZ2luIHRvIHRoZSBhcHBsaWNhdGlvbiBmcm9tIGEgZ2l0aHVi\nIGFjY291bnQuCi0gOnNvb246IGBUT0RPYCBDcmVhdGUgYSBwcm9qZWN0IGZy\nb20gYW4gZXhpc3RpbmcgZ2l0aHViIHJlcG9zaXRvcnkuCi0gOnNvb246IGBU\nT0RPYCBMaXN0IGNyZWF0ZWQgcHJvamVjdCBhbmQgc2hvdyB0aGUgbnVtYmVy\nIG9mIEkxOE4gc3RyaW5ncywgYXZhaWxhYmxlIGJyYW5jaGVzLCBhbmQsIHN1\ncHBvcnRlZCBsYW5ndWFnZXMuCi0gOnNvb246IGBUT0RPYCBBbGxvdyB0aGUg\ndXNlciB0byBlZGl0IEkxOE4gZmlsZXMgaW4gYSBzZWN1cmVkIHdheTogaXQg\nbXVzdCBndWFyYW50ZWUgdGhhdCBhbnkgb3RoZXIgZmlsZSB3aWxsIGJlIG1v\nZGlmaWVkLgotIDpzb29uOiBgVE9ET2AgQWxsb3cgdGhlIHVzZXIgdG8gd29y\nayBvbiBkaWZmZXJlbnQgZ2l0aHViIGJyYW5jaGVzLgotIDpzb29uOiBgVE9E\nT2AgT25jZSBhbGwgbW9kaWZpY2F0aW9uIGFyZSBkb25lLCBjcmVhdGUgYSBw\ndWxsLXJlcXVlc3Qgd2l0aCAtYXQgbGVhc3QtIG9uZSBhc3NpZ25lZS4KLSA6\nc29vbjogYFRPRE9gIEFsbG93IHRoZSB1c2VyIHRvIHJlY2VpdmUgbm90aWZp\nY2F0aW9ucyBmcm9tIGdpdGh1YiBvbiBlYWNoIGNoYW5nZSBvbiB0aGUgY3Vy\ncmVudCByZXBvc2l0b3J5IGFuZCBzZWUgaWYgaXQgYWZmZWN0cyBoaXMgY3Vy\ncmVudCB3b3JrLgoKIyMjIEFkZGl0aW9uYWwgY29vbCBmZWF0dXJlcyAtIHYx\nLjEKCi0gYFRPRE9gIFdoZW4gdGhlIHVzZXIgdmlld3MgdGhlIGxpc3Qgb2Yg\nZXhpc3RpbmcgdHJhbnNsYXRpb25zLCBoYSBjYW4gc2VhcmNoLCBvcGVuL2Nv\nbGxhcHNlIGFsbCB0cmFuc2xhdGlvbnMsIHNlZSBoaXMgY2hhbmdlcywgZXhw\nb3J0IGluIGRpZmZlcmVudCBmb3JtYXRzLgotIGBUT0RPYCBPbiBhIHNwZWNp\nZmljIHRyYW5zbGF0aW9uLCB0aGUgdXNlciBjYW4gc2VlIAogIC0gaWYgaXQg\nY29udGFpbnMgYSB2YWxpZCBIVE1MIHRhZ3MsIAogIC0gaWYgdGhpcyBzdHJp\nbmdzIGhhcyBwbHVyYWxpemVkIHZlcnNpb24sCiAgLSBob3cgbWFueSB2YXJp\nYWJsZSB0aGUgc3RyaW5nIGNvbnRhaW5zCiAgLSBob3cgbWFueSB0aW1lIGl0\nIGlzIHVzZWQgaW4gdGhlIGNvZGUKICAtIHVzYWdlcyBvZiB0aGlzIHRyYW5z\nbGF0aW9uIGluIGhpcyBjb2RlCi0gYFRPRE9gIEF1dG9tYXRpY2FsbHkgZmlu\nZCB0cmFuc2xhdGlvbiBmaWxlcyBhY2NvcmRpbmcgdG8gcHJvamVjdCB0eXBl\nIChSYWlscywgRGphbmdvLCBQbGF5LCBTeW1mb255LCAuLi4gYWxsIHRoZXNl\nIGZyYW1ld29ya3MgaGF2ZSB1c3VhbCBsb2NhdGlvbiBmb3IgdGhlbSkKCiMj\nIE1vY2t1cHMKCiMjIyBMb2dpbgohW1NjcmVlbnNob3RdKGRvYy9tb2NrdXBz\nL3NjcmVlbmNhcHR1cmUtbG9jYWxob3N0LTMwMDAtbG9naW4tMTQ3NjI2OTAw\nOTU4MS5wbmcpCgojIyMgUHJvamVjdHMgbGlzdAohW1NjcmVlbnNob3RdKGRv\nYy9tb2NrdXBzLzEtUHJvamVjdHMtbGlzdC5wbmcpCgojIyMgU3RyaW5nIGVk\naXRpb24KIVtTY3JlZW5zaG90XShkb2MvbW9ja3Vwcy8yLVByb2plY3QtZWRp\ndGlvbi5wbmcpCgojIyMgU3RyaW5nIGFkZGl0aW9uCiFbU2NyZWVuc2hvdF0o\nZG9jL21vY2t1cHMvMy1hZGRpbmctYS1sb2NhbGUucG5nKQoKIyMgUHJvamVj\ndCBJbnN0YWxsYXRpb24KCmBgYApnaXQgY2xvbmUgZ2l0QGdpdGh1Yi5jb206\neWxsaWV0aC9sb2NhbGVodWItbW9jay5naXQKZ2l0IGNsb25lIGdpdEBnaXRo\ndWIuY29tOnlsbGlldGgvbG9jYWxlaHViLmdpdApjZCBsb2NhbGVodWIKbnBt\nIGluc3RhbGwKbnBtIHN0YXJ0CmBgYAoKQVdTIGFjY291bnQ6IGh0dHBzOi8v\nNjczMDc3MjY5MTM2LnNpZ25pbi5hd3MuYW1hem9uLmNvbS9jb25zb2xl\n",
#   "encoding": "base64",
#   "_links": {
#     "self": "https://api.github.com/repos/yllieth/localehub/contents/README.md?ref=master",
#     "git": "https://api.github.com/repos/yllieth/localehub/git/blobs/3ce62b918700bfaee7cb05a9be111be427cbeb0b",
#     "html": "https://github.com/yllieth/localehub/blob/master/README.md"
#   }
# }
def contents_request(access_token, owner, repo, path, media_type):
    method = "GET"
    endpoint = "api.github.com"
    url = "/repos/" + owner + "/" + repo + "/contents/" + path
    headers = {
        "Authorization": "token " + access_token,   # https://developer.github.com/v3/#oauth2-token-sent-in-a-header
        "Accept": media_type,                       # https://developer.github.com/v3/repos/contents/#custom-media-types
        "Content-Type": media_type,
        "User-Agent": "Localehub"                   # https://developer.github.com/v3/#user-agent-required
    }

    print(method, endpoint + url, 'token ' + access_token)
    print('Headers: ', headers)
    conn = httplib.HTTPSConnection(endpoint)
    conn.request(method, url, None, headers)
    return conn.getresponse()

def build_media_type(query_string_parameters):
    media = query_string_parameters["media"] if ((query_string_parameters is not None) and ("media" in query_string_parameters)) else 'encoded'

    if (media == 'html'):
        return 'application/vnd.github.v3.html'
    elif (media == 'raw'):
        return 'application/vnd.github.v3.raw'
    else:
        return 'application/json'

def lambda_handler(event, context):
    github_token = event['requestContext']['authorizer']['githob']
    media_type = build_media_type(event["queryStringParameters"])
    owner = event['pathParameters']['owner']
    repo  = event['pathParameters']['repo']
    path  = event['pathParameters']['path']
    response = contents_request(github_token, owner, repo, path, media_type)
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