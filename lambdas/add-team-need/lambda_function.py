import uuid
import json
import pymysql
import os
import sys
import logging
import pytz
from datetime import datetime

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
host = os.environ['HOST']
db_name = os.environ['DB_NAME']

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_current_datetime_in_utc():
    local_datetime = pytz.timezone("Europe/Bratislava").localize(datetime.now())
    utc_datetime = local_datetime.astimezone(pytz.utc)
    return utc_datetime

def get_db_connection():
    try:
        conn = pymysql.connect(host=host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
    except pymysql.MySQLError as e:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit(1)
        
    logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")        
    
    return conn

def lambda_handler(event, _): 

    body_str = event.get('body', '')
    body_dict = json.loads(body_str)

    body_dict['uuid'] = str(uuid.uuid4())

    if 'consentIds' not in body_dict.keys() or not body_dict['consentIds']: 
        return {
            'statusCode': 400,
            'body': '\'consentIds\' array must be defined and not empty.'
        }

    if ('districtCode' not in body_dict.keys() or not body_dict['districtCode']
        or 'time' not in body_dict.keys() or not body_dict['time']
        or 'playerName' not in body_dict.keys() or not body_dict['playerName']
        or 'email' not in body_dict.keys() or not body_dict['email']):
         
        return {
        'statusCode': 400,
        'body': '\'districtCode\', \'time\', \'playerName\' and \'email\' attributes must be defined and not empty.'
    }

    utc_now = get_current_datetime_in_utc()

    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = "INSERT INTO TeamNeed (uuid, districtCode, address, time, playerName, email, phone, about, dateAdded) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        user_data = (body_dict['uuid'], body_dict['districtCode'], body_dict['address'], body_dict['time'], body_dict['playerName'], body_dict['email'], body_dict['phone'], body_dict['about'], utc_now)
        cursor.execute(sql, user_data)
        teamNeedId = int(cursor.lastrowid)
        conn.commit()
        cursor.close()

    body_dict['id'] = teamNeedId

    teamNeedConsents = [(teamNeedId, consentId, utc_now) for consentId in body_dict['consentIds']]
    with conn.cursor() as cursor:
        sql = "INSERT INTO TeamNeedConsent (teamNeedId, consentId, dateGranted) VALUES (%s, %s, %s)"
        cursor.executemany(sql, teamNeedConsents)
        conn.commit()
        cursor.close()

    return {
        'statusCode': 200,
        'body': json.dumps(body_dict)
    }