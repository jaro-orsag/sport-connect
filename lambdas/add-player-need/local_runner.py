import lambda_function

if __name__ == "__main__":
    mock_body = """
    {
        "name":"Jaroslav Orság",
        "districts":[
            301,
            701
        ],
        "availability":"aaaaaaa",
        "email":"jorsag@gmail.com",
        "phone":"917777614",
        "about":"bbbbbbb"
    }"""
    mock_event = {'version': '2.0', 'routeKey': 'POST /api/player-requests', 'rawPath': '/staging/api/player-requests', 'rawQueryString': '', 'headers': {'accept': 'application/json, text/plain, */*', 'accept-encoding': 'gzip, deflate, br, zstd', 'accept-language': 'en,sk;q=0.9,cs;q=0.8,en-US;q=0.7', 'content-length': '138', 'content-type': 'application/json', 'host': 'bxkfjtlh06.execute-api.us-east-1.amazonaws.com', 'origin': 'http://staging.futbal-spoluhrac.sk.s3-website-us-east-1.amazonaws.com', 'priority': 'u=1, i', 'referer': 'http://staging.futbal-spoluhrac.sk.s3-website-us-east-1.amazonaws.com/', 'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"', 'sec-ch-ua-mobile': '?0', 'sec-ch-ua-platform': '"macOS"', 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'cross-site', 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 'x-amzn-trace-id': 'Root=1-663b98aa-690ae98b51a0e61f2ac7adfe', 'x-forwarded-for': '178.41.99.135', 'x-forwarded-port': '443', 'x-forwarded-proto': 'https'}, 'requestContext': {'accountId': '111972598333', 'apiId': 'bxkfjtlh06', 'domainName': 'bxkfjtlh06.execute-api.us-east-1.amazonaws.com', 'domainPrefix': 'bxkfjtlh06', 'http': {'method': 'POST', 'path': '/staging/api/player-requests', 'protocol': 'HTTP/1.1', 'sourceIp': '178.41.99.135', 'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'}, 'requestId': 'XdTKqjhToAMES4A=', 'routeKey': 'POST /api/player-requests', 'stage': 'staging', 'time': '08/May/2024:15:22:18 +0000', 'timeEpoch': 1715181738311}, 'body': mock_body, 'isBase64Encoded': False}
    lambda_function.handler(mock_event, {})
