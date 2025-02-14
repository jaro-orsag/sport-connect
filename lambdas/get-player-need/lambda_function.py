import json
import pymysql
import os
import logging
from pythonjsonlogger import jsonlogger
import pytz

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
host = os.environ['HOST']
db_name = os.environ['DB_NAME']

# Configure the logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Add the JSON formatter to the logger
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

def get_db_connection():
    try:
        conn = pymysql.connect(host=host, user=user_name, passwd=password, db=db_name, connect_timeout=5, cursorclass=pymysql.cursors.DictCursor)
        return conn
    except pymysql.MySQLError as e:
        message = "ERROR: Unexpected error: Could not connect to MySQL instance."
        logger.error(message)
        logger.error(e)
        raise Exception(message)

def get_utc_datetime_in_local_zone(dt):
    if dt:
        # Ensure the datetime is timezone-aware
        utc_dt = dt.replace(tzinfo=pytz.utc)
        # Convert to local time
        local_dt = utc_dt.astimezone(pytz.timezone("Europe/Bratislava"))

        return local_dt.isoformat()
    return None

def int_to_bool(value):
    if value == 1:
        return True
    else:
        return False

def lambda_handler(event, _): 
    try:
        path_parameters = event.get('pathParameters')
            
        if path_parameters is None or 'uuid' not in path_parameters:
            return {
                'statusCode': 400,
                'body': '\'{uuid}\' path parameter must be defined and not empty.'
            }
        
        uuid = path_parameters['uuid']
        logger.info("getting player-need", extra={
            'uuid': uuid, 
            'need_type': "player_need", 
            'operation': 'get', 
            'stage': 'started'
        })
    
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = "SELECT id, uuid, isActive, dateDeactivated, playerName, availability, email, phone, about, isMarketingConsentGranted, dateMarketingConsentChanged, dateAdded FROM PlayerNeed WHERE uuid=%s"
            cursor.execute(sql, (uuid))
            result = cursor.fetchone()
            if result is None:
                logger.info("player-need not found", extra={
                    'uuid': uuid, 
                    'need_type': "player_need", 
                    'operation': 'get', 
                    'stage': 'not_found'
                })
                
                return {
                    'statusCode': 404,
                    'body': 'Record not found'
                }
            
            player_need_id = result['id']
            
            districts_sql = "SELECT districtCode FROM PlayerNeedDistrict WHERE playerNeedId = %s"
            cursor.execute(districts_sql, (player_need_id))
            districts_result = cursor.fetchall()
            district_codes = [item['districtCode'] for item in districts_result]
            
            response = {
                'id': player_need_id,
                'uuid': result['uuid'],
                'isActive': int_to_bool(result['isActive']),
                'dateDeactivated': get_utc_datetime_in_local_zone(result['dateDeactivated']),
                'playerName': result['playerName'],
                'availability': result['availability'],
                'email': result['email'],
                'phone': result['phone'],
                'about': result['about'],
                'isMarketingConsentGranted': result['isMarketingConsentGranted'],
                'dateMarketingConsentChanged': get_utc_datetime_in_local_zone(result['dateMarketingConsentChanged']),
                'dateAdded': get_utc_datetime_in_local_zone(result['dateAdded']),
                'districtCodes': district_codes
            }
            
        return {
            'statusCode': 200,
            'body': json.dumps(response)
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