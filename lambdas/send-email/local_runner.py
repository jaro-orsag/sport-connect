import lambda_function
import boto3
from moto import mock_aws

if __name__ == "__main__":

    mock = mock_aws()
    mock.start()

    client = boto3.client('ses', region_name='us-east-1')
    # Optionally, you can pre-create verified email addresses or other SES resources here
    client.verify_email_identity(EmailAddress='futbal-spoluhráč.sk <infoooo@futbal-spoluhrac.sk>')

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
                'Message': '{"subject": "Futbalov\\u00fd t\\u00edm sa na\\u0161iel", "notificationType": "match", "targetEmail": "jorsag@gmail.com", "needType": "player-need", "uuid": "5682c9e3-9bb5-4f76-a26f-75e01b12e75c", "matches": [{"Okres": "\\u017diar nad Hronom", "Adresa": "hdfghfgh", "\\u010cas hry": "dfhdf", "Meno": "Jaroslav Ors\\u00e1g", "Email": "jorsag@gmail.com", "Telef\\u00f3n": "+421917777614", "\\u010ea\\u013e\\u0161ie info": "", "Pridan\\u00e9": "5. 6. 2024 o 12:48"}]}', 
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
