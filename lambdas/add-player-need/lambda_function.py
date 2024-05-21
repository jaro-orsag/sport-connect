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

def lambda_handler(event, _): 

    body_str = event.get('body', '')
    body_dict = json.loads(body_str)

    body_dict['uuid'] = str(uuid.uuid4())

    if 'districtCodes' not in body_dict.keys() or not body_dict['districtCodes']: 
        return {
        'statusCode': 400,
        'body': '\'districtCodes\' array must be defined and not empty.'
    }

    if 'consentIds' not in body_dict.keys() or not body_dict['consentIds']: 
        return {
        'statusCode': 400,
        'body': '\'consentIds\' array must be defined and not empty.'
    }

    if ('playerName' not in body_dict.keys() or not body_dict['playerName']
        or 'availability' not in body_dict.keys() or not body_dict['availability']
        or 'email' not in body_dict.keys() or not body_dict['email']): 
        
        return {
        'statusCode': 400,
        'body': '\'playerName\', \'availability\' and \'email\' attributes must be defined and not empty.'
    }

    with conn.cursor() as cursor:
        sql = "INSERT INTO PlayerNeed (uuid, playerName, availability, email, phone, about, dateAdded) VALUES (%s, %s, %s, %s, %s, %s, NOW())"
        user_data = (body_dict['uuid'], body_dict['playerName'], body_dict['availability'], body_dict['email'], body_dict['phone'], body_dict['about'])
        cursor.execute(sql, user_data)
        playerNeedId = int(cursor.lastrowid)
        conn.commit()
        cursor.close()
        
    body_dict['id'] = playerNeedId

    playerNeedDistrictCodePairs = [(playerNeedId, districtCode) for districtCode in body_dict['districtCodes']]
    with conn.cursor() as cursor:
        sql = "INSERT INTO PlayerNeedDistrict (playerNeedId, districtCode) VALUES (%s, %s)"
        cursor.executemany(sql, playerNeedDistrictCodePairs)
        conn.commit()
        cursor.close()

    playerNeedConsentIdPairs = [(playerNeedId, consentId) for consentId in body_dict['consentIds']]
    with conn.cursor() as cursor:
        sql = "INSERT INTO PlayerNeedConsent (playerNeedId, consentId, dateGranted) VALUES (%s, %s, NOW())"
        cursor.executemany(sql, playerNeedConsentIdPairs)
        conn.commit()
        cursor.close()

    return {
        'statusCode': 200,
        'body': json.dumps(body_dict)
    }