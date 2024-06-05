import lambda_function
from moto import mock_aws
import boto3
import os

if __name__ == "__main__":
    mock = mock_aws()
    mock.start()
    sns_client = boto3.client('sns', region_name='us-east-1')
    
    notification_topic_response = sns_client.create_topic(Name='notification')
    notification_topic_response_arn =notification_topic_response['TopicArn']
    os.environ['NOTIFICATION_TOPIC_ARN'] = notification_topic_response_arn
    
    mock_event = {
        "Records": [
            {
                "Sns": {
                    "Message": "{\"uuid\": \"4e7d22ce-0884-4a53-9c5d-91229b45a5a1\", \"email\": \"something@example.com\"}"
                }
            }
        ]
    }
    result = lambda_function.lambda_handler(mock_event, {})
    print(result)
    
    mock.stop()
