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

    with conn.cursor() as cursor:
        sql = "INSERT INTO PlayerNeed (uuid, playerName, availability, email, phone, about, consent, dateAdded) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())"
        user_data = (body_dict['id'], body_dict['name'], body_dict['availability'], body_dict['email'], body_dict['phone'], body_dict['about'], 'WHATEVER')
        cursor.execute(sql, user_data)
        playerNeedId = int(cursor.lastrowid)
        conn.commit()
        cursor.close()

    playerNeedDistrictPairs = [(playerNeedId, district) for district in body_dict['districts']]

    with conn.cursor() as cursor:
        sql = "INSERT INTO PlayerNeedDistrict (playerNeedId, districtCode) VALUES (%s, %s)"
        cursor.executemany(sql, playerNeedDistrictPairs)
        conn.commit()
        cursor.close()

    return {
        'statusCode': 200,
        'body': json.dumps(body_dict)
    }