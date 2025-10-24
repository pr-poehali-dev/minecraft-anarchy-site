'''
Business: Manage purchase orders for privileges
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
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            """
            SELECT o.id, o.privilege_id, p.name, o.player_name, o.player_email, o.status, o.created_at
            FROM orders o
            JOIN privileges p ON o.privilege_id = p.id
            ORDER BY o.created_at DESC
            """
        )
        rows = cur.fetchall()
        
        orders = []
        for row in rows:
            orders.append({
                'id': row[0],
                'privilege_id': row[1],
                'privilege_name': row[2],
                'player_name': row[3],
                'player_email': row[4],
                'status': row[5],
                'created_at': row[6].isoformat() if row[6] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(orders),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        privilege_id = body_data.get('privilege_id')
        player_name = body_data.get('player_name')
        player_email = body_data.get('player_email', '')
        
        if not privilege_id or not player_name:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Privilege ID and player name required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "INSERT INTO orders (privilege_id, player_name, player_email, status) VALUES (%s, %s, %s, %s) RETURNING id",
            (int(privilege_id), player_name, player_email, 'pending')
        )
        
        order_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'order_id': order_id}),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        order_id = body_data.get('order_id')
        status = body_data.get('status')
        
        if not order_id or not status:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Order ID and status required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "UPDATE orders SET status = %s WHERE id = %s",
            (status, int(order_id))
        )
        
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
