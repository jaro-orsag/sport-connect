import logging
from pythonjsonlogger import jsonlogger
import boto3
import json
from botocore.exceptions import ClientError
from concurrent.futures import ThreadPoolExecutor

# Configure the logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Add the JSON formatter to the logger
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

SENDER = "futbal-spoluhráč.sk <hladanie@futbal-spoluhrac.sk>"
AWS_REGION = "us-east-1"
CHARSET = "UTF-8"

client = boto3.client('ses',region_name=AWS_REGION)

def format_html(beginning, list_of_dicts, ending):
    result = '<hr>'.join(
        '<br><br>'.join(f"{key}: {make_link_if_email(key, value)}" for key, value in dictionary.items())
        for dictionary in list_of_dicts
    )
    return f'<html><body>{beginning}<br><br><hr>{result}<hr><br><br>{ending}</body></html>'

def format_text(beginning, list_of_dicts, ending):
    result = '\r\n\r\n\r\n'.join(
        '\r\n\r\n'.join(f"{key}: {value}" for key, value in dictionary.items())
        for dictionary in list_of_dicts
    )
    return f'{beginning}\r\n\r\n{result}\r\n\r\n{ending}'

def make_link_if_email(key, value):
    return value if key != "email" else f"<a href='mailto: {value}'>{value}</a>"

def get_link(topicArn, need_type, uuid):
    subdomain = None
    if "staging-notification" in topicArn:
        subdomain = "staging"
    else:
        subdomain = "www"
    
    return f"https://{subdomain}.futbal-spoluhrac.sk/{need_type.replace("_", "-")}/{uuid}"

def handle_creation(target_email, uuid, need_type, link, subject, notification_type):
    entity = "tím" if need_type == "player-need" else "spoluhráča"
    part1 = f"Gratulujem, v tomto momente sme pre Teba začali hľadať {entity}."
    part2 = f"Hľadanie môžeš kedykoľvek zrušiť na stránke {link}"
    part3 = "Akonáhle pre Teba niečo nájdeme, pošleme Ti ďaľší e-mail. V ňom nájdeš aj kontakt. Na ďaľších detailoch sa už dohodnete spolu."
    
    body_html = f"{part1}<br><br>{part2}<br><br>{part3}"
    body_text = f"{part1}\r\n\r\n{part2}\r\n\r\n{part3}"
    
    try:
        client.send_email(
            Destination={
                'ToAddresses': [
                    target_email
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
        logger.info("sending email about creation finished", extra={
            'uuid': uuid, 
            'need_type': need_type, 
            'operation': 'sending_email', 
            'stage': 'finished',
            'notification_type': notification_type 
        })
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
    else:
        logger.info("confirmation email sent for %s %s", need_type, uuid)
    

def lambda_handler(event, _): 
    
    records = event.get('Records', [])
    logger.info("received %s records", len(records))
    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(process_record, records)

    return {
        'statusCode': 200,
        'body': json.dumps('Messages processed successfully')
    }
    
def process_record(record):

    try:
        message = json.loads(record['Sns']['Message'])
        
        subject = message['subject']
        target_email = message['targetEmail']
        need_type = message['needType']
        uuid = message['uuid']
        matches = message['matches']
        notification_type = message['notificationType']
        
        logger.info("sending email started", extra={
            'uuid': uuid, 
            'need_type': need_type, 
            'operation': 'sending_email', 
            'stage': 'started',
            'notification_type': notification_type 
        })
    except KeyError as e:
        logger.error(f"Key error: {e} - Record: {record}")
        return
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e} - Record: {record}")
        return
    except Exception as e:
        logger.error(f"Unexpected error: {e} - Record: {record}")
        return

    if None in [need_type, uuid, target_email, subject]:
        logger.error("not going to send email. none of the following can be 'None': need_type, target_email, subject, uuid. uuid: %s", uuid)
        return
    link = get_link(record['Sns']['TopicArn'], need_type, uuid)
    
    if notification_type == "creation":
        handle_creation(target_email, uuid, need_type, link, subject, notification_type)
        return

    if matches == None or len(matches) == 0:
        logger.error("not going to send email. matches must not be empty. uuid: %s", uuid)
        return
    
    end_search = f"Ak už nechceš dostávať ďaľšie emaily, svoje hľadanie môžeš kedykoľvek zrušiť na tomto linku: {link}"
    message_beginning = f"Neváhaj kontaktovať kohokoľvek zo zoznamu nižšie. {end_search}"
    message_ending = end_search

    body_html = format_html(message_beginning, matches, message_ending)
    body_text = format_text(message_beginning, matches, message_ending)

    try:
        client.send_email(
            Destination={
                'ToAddresses': [
                    target_email
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
        logger.info("sending email about match finished", extra={
            'uuid': uuid, 
            'need_type': need_type, 
            'operation': 'sending_email', 
            'stage': 'finished',
            'notification_type': notification_type 
        })
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
    else:
        logger.info("email about match sent for %s %s", need_type, uuid)
        
