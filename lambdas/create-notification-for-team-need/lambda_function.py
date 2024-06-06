import pymysql
import os
import logging
import boto3
import json

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
host = os.environ['HOST']
db_name = os.environ['DB_NAME']

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_db_connection():
    try:
        conn = pymysql.connect(host=host, user=user_name, passwd=password, db=db_name, connect_timeout=5, cursorclass=pymysql.cursors.DictCursor)
    except pymysql.MySQLError as e:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit(1)
    
    return conn

def lambda_handler(event, _): 
    sns_client = boto3.client('sns', region_name='us-east-1')
    notification_topic_arn = os.environ['NOTIFICATION_TOPIC_ARN']
    
    for record in event.get('Records', []):
        team_need_uuid = None 
        team_need_email = None 
        try:
            message = json.loads(record['Sns']['Message'])
            team_need_uuid = message['uuid']
            team_need_email = message['email']
            logger.info("creating notification for team-need %s", team_need_uuid)
        except KeyError as e:
            logger.error(f"Key error: {e} - Record: {record}")
            return
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e} - Record: {record}")
            return
        except Exception as e:
            logger.error(f"Unexpected error: {e} - Record: {record}")
            return
        
        if team_need_uuid == None or team_need_email == None:
            logger.error(f"Either uuid or email is missing in record: {record}")
            return 

        matches = get_matches(team_need_uuid)
        if len(matches) == 0:
            logger.warning("no matches found for team_need %s, not going to publish to sns topic", team_need_uuid)
            return

        notification = create_notification(team_need_uuid, team_need_email, matches)            
        publish_to_sns(notification, sns_client, notification_topic_arn)

def create_notification(team_need_uuid, email, matches):
    return {
        "subject": "Našiel sa spoluhráč",
        "targetEmail": email,
        "needType": 'team-need',
        "uuid": team_need_uuid,
        "matches": matches
    }

def get_matches(team_need_uuid):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            matches_sql = """
                SELECT
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

            cursor.execute(matches_sql, (team_need_uuid))
            matches_result = cursor.fetchall()

            return matches_result
    finally:
        if conn:
            conn.close()
        
def publish_to_sns(notification, sns_client, notification_topic_arn):
    logger.info("publishing notification for team-need %s to sns topic", notification['uuid'])
    sns_client.publish(
        TopicArn=notification_topic_arn,
        Message=json.dumps(notification)
    )
    