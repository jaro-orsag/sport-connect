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
        return conn
    except pymysql.MySQLError as e:
        message = "ERROR: Unexpected error: Could not connect to MySQL instance."
        logger.error(message)
        logger.error(e)
        raise Exception(message)

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
    
    conn = None
    try:
        utc_now = get_current_datetime_in_utc()
        conn = get_db_connection()
            
        with conn.cursor() as cursor:
            sql = "UPDATE TeamNeed SET isMarketingConsentGranted=%s, dateMarketingConsentChanged=%s WHERE uuid=%s"
            isGranted = True if action==GRANT_ACTION else False            
            user_data = (isGranted, utc_now, uuid)
            cursor.execute(sql, user_data)
            conn.commit()
            cursor.close()
            
            return {
                'statusCode': 204
            }

    finally:
        if conn:
            conn.close()