from datetime import datetime
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

def get_current_datetime_in_utc():

    return datetime.now(pytz.utc)
    
def lambda_handler(event, _): 
    path_parameters = event.get('pathParameters')
        
    if path_parameters is None or 'uuid' not in path_parameters:
        return {
            'statusCode': 400,
            'body': '\'{uuid}\' path parameter must be defined and not empty.'
        }
    
    uuid = path_parameters['uuid']
    
    conn = None
    try:
        utc_now = get_current_datetime_in_utc()
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = "UPDATE TeamNeed SET isActive=false, dateDeactivated=%s WHERE uuid=%s"
            user_data = (utc_now, uuid)
            cursor.execute(sql, user_data)
            conn.commit()
            cursor.close()

        logger.info("deactivated team-need", extra={
            'uuid': uuid, 
            'need_type': "team_need", 
            'operation': 'deactivation', 
            'stage': 'finished'
        })

        return {
            'statusCode': 204
        }
    finally:
        if conn:
            conn.close()