'''
Business: Manage privileges and orders (CRUD for game privileges and purchase orders)
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict
'''

import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('path', '/')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Session',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    if method == 'GET':
        cur.execute(
            "SELECT id, name, description, price, features, is_active, image_url FROM privileges WHERE is_active = true ORDER BY price"
        )
        rows = cur.fetchall()
        
        privileges = []
        for row in rows:
            privileges.append({
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'price': float(row[3]),
                'features': row[4],
                'is_active': row[5],
                'image_url': row[6]
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(privileges),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        name = body_data.get('name')
        description = body_data.get('description', '')
        price = body_data.get('price')
        features = body_data.get('features', [])
        image_url = body_data.get('image_url')
        
        if not name or price is None:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Name and price required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "INSERT INTO privileges (name, description, price, features, image_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, description, float(price), features, image_url)
        )
        
        privilege_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'id': privilege_id}),
            'isBase64Encoded': False
        }
    
    if method == 'DELETE':
        query_params = event.get('queryStringParameters', {})
        privilege_id = query_params.get('id') if query_params else None
        
        if not privilege_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Privilege ID required'}),
                'isBase64Encoded': False
            }
        
        cur.execute("UPDATE privileges SET is_active = false WHERE id = %s", (int(privilege_id),))
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }