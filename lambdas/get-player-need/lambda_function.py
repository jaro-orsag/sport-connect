import json
import pymysql
import os
import sys
import logging
import pytz

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
host = os.environ['HOST']
db_name = os.environ['DB_NAME']

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_db_connection():
    try:
        conn = pymysql.connect(host=host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
    except pymysql.MySQLError as e:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit(1)
        
    logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")        
    
    return conn

def get_utc_datetime_in_local_zone(dt):
    if dt:
        # Ensure the datetime is timezone-aware
        utc_dt = dt.replace(tzinfo=pytz.utc)
        # Convert to local time
        local_dt = utc_dt.astimezone(pytz.timezone("Europe/Bratislava"))

        return local_dt.isoformat()
    return None

def lambda_handler(event, _): 
    path_parameters = event.get('pathParameters')
        
    if path_parameters is None or 'uuid' not in path_parameters:
        return {
            'statusCode': 400,
            'body': '\'{uuid}\' path parameter must be defined and not empty.'
        }
    
    uuid = path_parameters['uuid']
    
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = "SELECT id, uuid, playerName, availability, email, phone, about, dateAdded FROM PlayerNeed WHERE uuid=%s"
            cursor.execute(sql, (uuid))
            result = cursor.fetchone()
            if result is None:
                return {
                    'statusCode': 404,
                    'body': json.dumps('Record not found')
                }
            
            player_need_id = result[0]
            
            districts_sql = "SELECT districtCode FROM PlayerNeedDistrict WHERE playerNeedId = %s"
            cursor.execute(districts_sql, (player_need_id))
            districts_result = cursor.fetchall()
            district_codes = [item[0] for item in districts_result]
            
            consents_sql = "SELECT consentId FROM PlayerNeedConsent WHERE playerNeedId = %s"
            cursor.execute(consents_sql, (player_need_id))
            consents_result = cursor.fetchall()
            consents_ids = [item[0] for item in consents_result]
            
            response = {
                'id': player_need_id,
                'uuid': result[1],
                'playerName': result[2],
                'availability': result[3],
                'email': result[4],
                'phone': result[5],
                'about': result[6],
                'dateAdded': get_utc_datetime_in_local_zone(result[7]),
                'districtCodes': district_codes,
                'consentsIds': consents_ids
            }
            
            return {
                'statusCode': 200,
                'body': json.dumps(response)
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {str(e)}")
        }
    finally:
        if conn:
            conn.close()