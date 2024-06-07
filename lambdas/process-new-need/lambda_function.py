import json
import pymysql
import os
import logging
import boto3

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
host = os.environ['HOST']
db_name = os.environ['DB_NAME']

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

PLAYER_NEED = "player_need"
TEAM_NEED = "team_need"

def get_db_connection():
    try:
        conn = pymysql.connect(host=host, user=user_name, passwd=password, db=db_name, connect_timeout=5, cursorclass=pymysql.cursors.DictCursor)
        return conn
    except pymysql.MySQLError as e:
        message = "ERROR: Unexpected error: Could not connect to MySQL instance."
        logger.error(message)
        logger.error(e)
        raise Exception(message)

def lambda_handler(event, _): 
    try:
        records = event.get('Records', [])
        logger.info("received %s records", len(records))
        for record in records:
            process_record(record)

        return {
            'statusCode': 200,
            'body': json.dumps('Messages processed successfully')
        }

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        
        return {
            'statusCode': 500,
            'body': "Internal Server Error"
        }

def process_record(record):
    try:
        need_type = None
        uuid = None
        
        try:
            message = json.loads(record['Sns']['Message'])
            
            need_type = message['needType']
            uuid = message['uuid']
        except KeyError as e:
            logger.error(f"Key error: {e} - Record: {record}")
            return
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e} - Record: {record}")
            return
        
        try:
            conn = get_db_connection()
            
            logger.info("sending notification to new %s %s", need_type, uuid)
            matching_entities_uuids = send_notification_about_matching_entities(conn, need_type, uuid)
            
            logger.info("sending notifications to matching entities of new %s %s", need_type, uuid)
            for matching_entity_uuid in matching_entities_uuids:            
                send_notification_about_matching_entities(conn, get_complementary_need_type(need_type), matching_entity_uuid)
        finally:
            if conn:
                conn.close()

    except Exception as e:
        logger.error(f"Unexpected error: {e} - Record: {record}")
        return

def get_complementary_need_type(need_type):
    if need_type == PLAYER_NEED:
        return TEAM_NEED
    elif need_type == TEAM_NEED:
        return PLAYER_NEED
    else:
        raise_unsupported_need_type(need_type)

def send_notification_about_matching_entities(conn, need_type, uuid):
    matching_entities = get_matching_entities(conn, need_type, uuid)
    matching_entities_uuids = [entity['uuid'] for entity in matching_entities]
    
    sns_client = boto3.client('sns', region_name='us-east-1')
    notification_topic_arn = os.environ['NOTIFICATION_TOPIC_ARN']
    
    create_and_send_notification(uuid, need_type, matching_entities, sns_client, notification_topic_arn)
    
    return matching_entities_uuids


def create_and_send_notification(uuid, need_type, matching_entities, sns_client, notification_topic_arn):
    if len(matching_entities) == 0:
        logger.error("No matching entities found for %s %s, sending nothing", need_type, uuid)
        return
    
    logger.info("sending notification about %s matching entities of %s %s", len(matching_entities), need_type, uuid)
    notification = None
    if need_type == TEAM_NEED:
        email = matching_entities[0]['teamEmail']
        notification = {
            "subject": "Našiel sa spoluhráč",
            "targetEmail": email,
            "needType": 'team-need',
            "uuid": uuid,
            "matches": removeUnnecessaryKeys(matching_entities),
            "notificationType": "match"
        }
    elif need_type == PLAYER_NEED:
        email = matching_entities[0]['playerEmail']
        notification = {
            "subject": "Našiel sa tím",
            "targetEmail": email,
            "needType": "player-need",
            "uuid": uuid,
            "matches": removeUnnecessaryKeys(matching_entities),
            "notificationType": "match"
        }
    else:
        raise_unsupported_need_type(need_type)

    sns_client.publish(
        TopicArn=notification_topic_arn,
        Message=json.dumps(notification)
    )

def removeUnnecessaryKeys(matching_entities):
    return [{k: v for k, v in entity.items() if k not in ['playerEmail', 'teamEmail', 'uuid']} for entity in matching_entities]

def get_matching_entities(conn, need_type, uuid):
    if need_type == PLAYER_NEED:
        return get_matching_teams(conn, uuid)
    elif need_type == TEAM_NEED:
        return get_matching_players(conn, uuid)
    else:
        raise_unsupported_need_type(need_type)

def raise_unsupported_need_type(need_type):
    message = f"Unsupported need_type: {need_type}"
    logger.error(message);
    raise Exception(message)

def get_matching_teams(conn, uuid):
    query = """
        SELECT 
            pn.email AS playerEmail,
            tn.uuid AS uuid,
            tn.playerName AS 'Kontaktná osoba',
            tn.email AS 'Email',
            tn.phone AS 'Telefón',
            d.districtName AS 'Okres',
            tn.address AS 'Adresa',
            tn.time AS 'Čas hry',
            tn.about AS 'Ďaľšie info',
            DATE_FORMAT(CONVERT_TZ(tn.dateAdded, '+00:00', 'Europe/Bratislava'), '%%e. %%c. %%Y o %%k:%%i') AS 'Pridané'
        FROM 
            PlayerNeed pn
            INNER JOIN PlayerNeedDistrict pnd
                ON pn.id = pnd.playerNeedId
            INNER JOIN TeamNeed tn
                ON tn.districtcode = pnd.districtcode
            LEFT OUTER JOIN District d
                on tn.districtCode = d.code
        WHERE
            tn.isActive 
            AND pn.isActive
            AND pn.uuid=%s
        ORDER BY 
            tn.dateAdded DESC
    """
    with conn.cursor() as cursor:
        cursor.execute(query, (uuid))
        teams = cursor.fetchall()

        return teams

def get_matching_players(conn, uuid):
    query = """
        SELECT
            tn.email AS teamEmail,
            pn.uuid AS uuid,
            pn.playerName AS 'Meno',
            pn.availability AS 'Vyhovujúce časy',
            pn.email AS 'Email',
            pn.phone AS 'Telefón',
            pn.about AS 'Ďaľšie info',
            DATE_FORMAT(CONVERT_TZ(pn.dateAdded, '+00:00', 'Europe/Bratislava'), '%%e. %%c. %%Y o %%k:%%i') AS 'Pridané'
        FROM 
            TeamNeed tn
            INNER JOIN PlayerNeedDistrict pnd
                ON tn.districtCode = pnd.districtCode
            INNER JOIN PlayerNeed pn
                ON pn.id = pnd.playerNeedId
        WHERE
            tn.isActive 
            AND pn.isActive
            AND tn.uuid=%s
        ORDER BY 
            pn.dateAdded DESC
    """
    with conn.cursor() as cursor:
        cursor.execute(query, (uuid))
        players = cursor.fetchall()

        return players
    