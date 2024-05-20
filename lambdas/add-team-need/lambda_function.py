import uuid
import json
import pymysql
import os
import sys
import logging

user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
host = os.environ['HOST']
db_name = os.environ['DB_NAME']

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(host=host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit(1)

logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")

def handler(event, _): 

    body_str = event.get('body', '')
    body_dict = json.loads(body_str)

    body_dict['id'] = str(uuid.uuid4())

    if 'consents' not in body_dict.keys() or not body_dict['consents']: 
        return {
            'statusCode': 400,
            'body': '\'consents\' array must be defined and not empty.'
        }
        

    if not body_dict['district'] or not body_dict['time'] or not body_dict['name'] or not body_dict['email']: 
        return {
        'statusCode': 400,
        'body': '\'district\', \'time\', \'name\' and \'email\' attributes must be defined and not empty.'
    }

    with conn.cursor() as cursor:
        sql = "INSERT INTO TeamNeed (uuid, districtCode, address, time, playerName, email, phone, about, dateAdded) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())"
        user_data = (body_dict['id'], body_dict['district'], body_dict['address'], body_dict['time'], body_dict['name'], body_dict['email'], body_dict['phone'], body_dict['about'])
        cursor.execute(sql, user_data)
        teamNeedId = int(cursor.lastrowid)
        conn.commit()
        cursor.close()

    teamNeedConsentPairs = [(teamNeedId, consent) for consent in body_dict['consents']]
    with conn.cursor() as cursor:
        sql = "INSERT INTO TeamNeedConsent (teamNeedId, consentId, dateGranted) VALUES (%s, %s, NOW())"
        cursor.executemany(sql, teamNeedConsentPairs)
        conn.commit()
        cursor.close()

    return {
        'statusCode': 200,
        'body': json.dumps(body_dict)
    }