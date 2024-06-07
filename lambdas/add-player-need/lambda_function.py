import uuid
import json
import pymysql
import os
import logging
import pytz
from datetime import datetime
import boto3

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
host = os.environ['HOST']
db_name = os.environ['DB_NAME']

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_current_datetime_in_utc():
    return datetime.now(pytz.utc)

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
        body_str = event.get('body', '')
        body_dict = json.loads(body_str)

        body_dict['uuid'] = str(uuid.uuid4())

        if 'districtCodes' not in body_dict.keys() or not body_dict['districtCodes']: 
            return {
            'statusCode': 400,
            'body': '\'districtCodes\' array must be defined and not empty.'
        }

        if ('playerName' not in body_dict.keys() or not body_dict['playerName']
            or 'availability' not in body_dict.keys() or not body_dict['availability']
            or 'email' not in body_dict.keys() or not body_dict['email']): 
            
            return {
            'statusCode': 400,
            'body': '\'playerName\', \'availability\' and \'email\' attributes must be defined and not empty.'
        }
            
        utc_now = get_current_datetime_in_utc()
        
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = "INSERT INTO PlayerNeed (uuid, isActive, playerName, availability, email, phone, about, isMarketingConsentGranted, dateMarketingConsentChanged, dateAdded) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            user_data = (body_dict['uuid'], body_dict['isActive'], body_dict['playerName'], body_dict['availability'], body_dict['email'], body_dict['phone'], body_dict['about'], body_dict['isMarketingConsentGranted'], utc_now, utc_now)
            cursor.execute(sql, user_data)
            player_need_id = int(cursor.lastrowid)
            conn.commit()
        
        body_dict['id'] = player_need_id
        
        player_need_district_code_pairs = [(player_need_id, district_code) for district_code in body_dict['districtCodes']]
        with conn.cursor() as cursor:
            sql = "INSERT INTO PlayerNeedDistrict (playerNeedId, districtCode) VALUES (%s, %s)"
            cursor.executemany(sql, player_need_district_code_pairs)
            conn.commit()

        logger.info("added player_need %s", body_dict['uuid'])
    
        sns_client = boto3.client('sns', region_name='us-east-1')
        new_need_topic_arn = os.environ['NEW_NEED_TOPIC_ARN']
        sns_client.publish(
            TopicArn=new_need_topic_arn,
            Message=json.dumps({
                "uuid": body_dict['uuid'],
                "needType": "player_need",
                "email": body_dict['email']
            })
        )
        
        logger.info("sent player_need %s for further processing", body_dict['uuid'])
        
        return {
            'statusCode': 200,
            'body': json.dumps(body_dict)
        }

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        
        return {
            'statusCode': 500,
            'body': "Internal Server Error"
        }
        
    finally:
        if conn:
            conn.close()