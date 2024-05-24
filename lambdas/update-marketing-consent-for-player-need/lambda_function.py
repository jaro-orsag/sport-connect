from datetime import datetime
import pymysql
import os
import sys
import logging
import pytz
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
        
    logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")        
    
    return conn

def get_current_datetime_in_utc():

    return datetime.now(pytz.utc)
    
def lambda_handler(event, _): 
    GRANT_ACTION = "grant"
    REVOKE_ACTION = "revoke"
    
    path_parameters = event.get('pathParameters')
    if path_parameters is None or 'uuid' not in path_parameters:
        return {
            'statusCode': 400,
            'body': '\'{uuid}\' path parameter must be defined and not empty.'
        }
    uuid = path_parameters['uuid']

    body_str = event.get('body', '')
    body_dict = json.loads(body_str)
    if 'action' not in body_dict.keys() or not body_dict['action']: 
        return {
            'statusCode': 400,
            'body': '\'action\' must be defined.'
        }
    action = body_dict['action']
    if action != GRANT_ACTION and action != REVOKE_ACTION:
        return {
            'statusCode': 400,
            'body': f'\'action\' must be either \'{GRANT_ACTION}\' or \'{REVOKE_ACTION}\'.'
        }
    
    try:
        utc_now = get_current_datetime_in_utc()
        conn = get_db_connection()
            
        with conn.cursor() as cursor:
            dateColumn = 'dateGranted' if action==GRANT_ACTION else 'dateRevoked'
            sql = f"UPDATE PlayerNeedConsent SET isActive=(%s), {dateColumn}=(%s) WHERE playerNeedId=(SELECT id FROM PlayerNeed where uuid=(%s)) AND consentId=4"
            isActive = True if action==GRANT_ACTION else False            
            user_data = (isActive, utc_now, uuid)
            cursor.execute(sql, user_data)
            conn.commit()
            rowcount = cursor.rowcount
            cursor.close()
            
            if rowcount > 1:
                msg = 'more than 1 consent found'
                logger.warn(msg)
                return {
                    'statusCode': 500,
                    'body': msg
                }
           
            if rowcount == 0:
                msg = 'consent not found'
                logger.warn(msg)
                return {
                    'statusCode': 404,
                    'body': msg
                }

            return {
                'statusCode': 204
            }


    finally:
        if conn:
            conn.close()