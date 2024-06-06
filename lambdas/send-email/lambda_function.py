import logging
import boto3
import json
from botocore.exceptions import ClientError

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

SENDER = "futbal-spoluhráč.sk <hladanie@futbal-spoluhrac.sk>"
RECIPIENT = "futbalspoluhrac@gmail.com"
AWS_REGION = "us-east-1"
CHARSET = "UTF-8"
        
def format_html(beginning, list_of_dicts, ending):
    result = []
    for dictionary in list_of_dicts:
        dict_string = '<br><br>'.join(f"{key}: {make_link_if_email(key, value)}" for key, value in dictionary.items())
        result.append(dict_string)
    return f'<html><body>{beginning}<br><br><hr>' + '<hr>'.join(result) + f'<hr><br><br>{ending}</body></html>'

def format_text(beginning, list_of_dicts, ending):
    result = []
    for dictionary in list_of_dicts:
        dict_string = '\r\n\r\n'.join(f"{key}: {value}" for key, value in dictionary.items())
        result.append(dict_string)
    return f'{beginning}\r\n\r\n' + '\r\n\r\n\r\n'.join(result) + f'\r\n\r\n{ending}'

def make_link_if_email(key, value):
    return value if key != "email" else f"<a href='mailto: {value}'>{value}</a>"

def get_link(topicArn, need_type, uuid):
    subdomain = None
    if "staging-notification" in topicArn:
        subdomain = "staging"
    else:
        subdomain = "www"
    
    return f"https://{subdomain}.futbal-spoluhrac.sk/{need_type}/{uuid}"

def handle_creation(client, target_email, uuid, need_type, link, subject):
    entity = "tím" if need_type == "player-need" else "spoluhráča"
    part1 = f"Gratulujem, v tomto momente sme pre Teba začali hľadať {entity}."
    part2 = f"Hľadanie môžeš kedykoľvek zrušiť na stránke {link}"
    part3 = "Akonáhle pre Teba niečo nájdeme, pošleme Ti ďaľší e-mail. V ňom nájdeš aj kontakt. Na ďaľších detailoch sa už dohodnete spolu."
    
    body_html = f"{part1}<br><br>{part2}<br><br>{part3}"
    body_text = f"{part1}\r\n\r\n{part2}\r\n\r\n{part3}"
    
    logger.info("going to send confirmation email for %s %s", need_type, uuid)
    try:
        client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT, # target_email
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': body_html,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': body_text,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': subject,
                },
            },
            Source=SENDER,
        )
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
    else:
        logger.info("confirmation email sent for %s %s", need_type, uuid)
    

def lambda_handler(event, _): 
    client = boto3.client('ses',region_name=AWS_REGION)
    
    for record in event.get('Records', []):
        subject = None
        target_email = None
        need_type = None
        uuid = None
        matches = None
        
        try:
            message = json.loads(record['Sns']['Message'])
            
            subject = message['subject']
            target_email = message['targetEmail']
            need_type = message['needType']
            uuid = message['uuid']
            matches = message['matches']
            notification_type = message['notificationType']
            
            logger.info("received notification of type %s for %s %s", notification_type, need_type, uuid)
        except KeyError as e:
            logger.error(f"Key error: {e} - Record: {record}")
            continue
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e} - Record: {record}")
            continue
        except Exception as e:
            logger.error(f"Unexpected error: {e} - Record: {record}")
            continue

        if need_type == None or uuid == None or target_email == None or subject == None:
            logger.error("not going to send email. none of the following can be 'None': need_type, target_email, subject, uuid. uuid: %s", uuid)
            continue
        link = get_link(record['Sns']['TopicArn'], need_type, uuid)
        
        if notification_type == "creation":
            handle_creation(client, target_email, uuid, need_type, link, subject)
            continue

        if matches == None or len(matches) == 0:
            logger.error("not going to send email. matches must not be empty. uuid: %s", uuid)
            continue
        
        end_search = f"Ak už nechceš dostávať ďaľšie emaily, svoje hľadanie môžeš kedykoľvek zrušiť na tomto linku: {link}"
        message_beginning = f"Neváhaj kontaktovať kohokoľvek zo zoznamu nižšie. {end_search}"
        message_ending = end_search

        body_html = format_html(message_beginning, matches, message_ending)
        body_text = format_text(message_beginning, matches, message_ending)

        logger.info("going to send email about match for %s %s", need_type, uuid)

        try:
            client.send_email(
                Destination={
                    'ToAddresses': [
                        RECIPIENT, # target_email
                    ],
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': CHARSET,
                            'Data': body_html,
                        },
                        'Text': {
                            'Charset': CHARSET,
                            'Data': body_text,
                        },
                    },
                    'Subject': {
                        'Charset': CHARSET,
                        'Data': subject,
                    },
                },
                Source=SENDER,
            )
        except ClientError as e:
            logger.error(e.response['Error']['Message'])
        else:
            logger.info("email about match sent for %s %s", need_type, uuid)
            
    return {
        'statusCode': 200,
        'body': json.dumps('Message processed successfully')
    }