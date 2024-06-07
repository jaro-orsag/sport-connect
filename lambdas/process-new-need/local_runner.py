import lambda_function
from moto import mock_aws
import boto3
import os

if __name__ == "__main__":
    mock = mock_aws()
    mock.start()
    sns_client = boto3.client('sns', region_name='us-east-1')
    
    sns_client = boto3.client('sns', region_name='us-east-1')
    
    notification_topic_response = sns_client.create_topic(Name='notification')
    notification_topic_response_arn =notification_topic_response['TopicArn']
    os.environ['NOTIFICATION_TOPIC_ARN'] = notification_topic_response_arn

    mock_event = {'Records': [
        {
            'EventSource': 'aws:sns', 
            'EventVersion': '1.0', 
            'EventSubscriptionArn': 'arn:aws:sns:us-east-1:111972598333:staging-notification:b177937d-1218-43f8-958d-8ceac2eb7c92', 
            'Sns': {
                'Type': 'Notification', 
                'MessageId': 'b6d2ae68-2971-5830-ae4b-f0b35c7ae25b', 
                'TopicArn': 'arn:aws:sns:us-east-1:111972598333:staging-notification', 
                'Subject': None, 
                'Message': '{"needType": "player_need", "uuid": "c341f675-7e23-4a19-8e99-b59e592e659f"}', 
                'Timestamp': '2024-06-06T08:26:51.453Z', 
                'SignatureVersion': '1', 
                'Signature': 'd6XEX8xQav1Gyu2P6OrIm1qdsy31yfahMj++Z5lyEl6AMUkHPrM2XX5gu5WKSiVF4xpXCjt/OnOrmylfWHH59RBFYsHvpPDN8tJx0m+a9WKZh2KFcbUCqAAmUvoSj0TuSJgeDiL/US9XHgG4v1zfAg0xKK7eCr07VLr0sDYYskUS8LLm4Jrk+B5POnjnvE/KKN0aZMRFi55hMgUBmeosjRvS3bMN5CU3fdvYFJ3xhWo1lJWA2LdZwechKFSw2JUEPZ+WSkh60xUIiTPQ8siJzzzhliJ5wQb+bxV6c8LxhjZwUfaT0rCi99r1r9k5qYSiYIkfOATTqp55YXtD2n0yGA==', 
                'SigningCertUrl': 'https://sns.us-east-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem', 
                'UnsubscribeUrl': 'https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:111972598333:staging-notification:b177937d-1218-43f8-958d-8ceac2eb7c92', 
                'MessageAttributes': {}
            }
        }
    ]}
    result = lambda_function.lambda_handler(mock_event, {})
    print(result)
    
    mock.stop()