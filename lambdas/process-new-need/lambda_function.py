import json
import pymysql
import os
import logging
import boto3
from collections import defaultdict

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
            
            logger.info("going to process new %s %s", need_type, uuid)
            matching_entities_uuids = send_notification_about_matching_entities(conn, need_type, [uuid])
            
            logger.info("sending notifications to matching entities of new %s %s", need_type, uuid)
            send_notification_about_matching_entities(conn, get_complementary_need_type(need_type), matching_entities_uuids[uuid])
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

def send_notification_about_matching_entities(conn, parent_need_type, parent_entities_uuids):
    matching_entities = get_matching_entities(conn, parent_need_type, parent_entities_uuids)
    
    matching_entities_grouped_by_parent_entity_uuid = defaultdict(list)
    matching_uuids_grouped_by_parent_uuids = defaultdict(list)
    for matching_entity in matching_entities:
        parent_uuid = matching_entity['parentUuid']
        matching_entities_grouped_by_parent_entity_uuid[parent_uuid].append(matching_entity)
        matching_uuids_grouped_by_parent_uuids[parent_uuid].append(matching_entity['uuid'])
    
    sns_client = boto3.client('sns', region_name='us-east-1')
    notification_topic_arn = os.environ['NOTIFICATION_TOPIC_ARN']
    
    for parent_uuid, matching_entities_group in matching_entities_grouped_by_parent_entity_uuid.items():
        create_and_send_notification(parent_uuid, parent_need_type, matching_entities_group, sns_client, notification_topic_arn)
    
    return matching_uuids_grouped_by_parent_uuids


def create_and_send_notification(uuid, need_type, matching_entities, sns_client, notification_topic_arn):
    if len(matching_entities) == 0:
        logger.error("No matching entities found for %s %s, sending nothing", need_type, uuid)
        return
    
    logger.info("sending notification about %s matching entities to %s %s", len(matching_entities), need_type, uuid)
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

def get_matching_teams(conn, uuids):
    placeholders = ', '.join(['%s'] * len(uuids))
    query = f"""
        SELECT 
            pn.email AS playerEmail,
            tn.uuid AS uuid,
            pn.uuid AS parentUuid,
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
            AND pn.uuid IN ({placeholders})
        ORDER BY 
            tn.dateAdded DESC
    """
    with conn.cursor() as cursor:
        cursor.execute(query, uuids)
        teams = cursor.fetchall()

        return teams

def get_matching_players(conn, uuids):
    placeholders = ', '.join(['%s'] * len(uuids))
    query = f"""
        SELECT
            tn.email AS teamEmail,
            pn.uuid AS uuid,
            tn.uuid AS parentUuid,
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
            AND tn.uuid IN ({placeholders})
        ORDER BY 
            pn.dateAdded DESC
    """
    with conn.cursor() as cursor:
        cursor.execute(query, uuids)
        players = cursor.fetchall()

        return players
    