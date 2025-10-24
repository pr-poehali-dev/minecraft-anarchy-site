'''
Business: Manage FAQ entries (list, create, update, delete)
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with statusCode, headers, body
'''

import json
import os
import psycopg2
from typing import Dict, Any, List

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    if method == 'GET':
        cur.execute("""
            SELECT id, question, answer, order_index, created_at 
            FROM t_p98795140_minecraft_anarchy_si.faqs 
            ORDER BY order_index ASC
        """)
        
        rows = cur.fetchall()
        faqs: List[Dict[str, Any]] = []
        
        for row in rows:
            faqs.append({
                'id': row[0],
                'question': row[1],
                'answer': row[2],
                'order_index': row[3],
                'created_at': row[4].isoformat() if row[4] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(faqs),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        question = body_data.get('question')
        answer = body_data.get('answer')
        order_index = body_data.get('order_index', 0)
        
        cur.execute("""
            INSERT INTO t_p98795140_minecraft_anarchy_si.faqs (question, answer, order_index)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (question, answer, order_index))
        
        faq_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'id': faq_id}),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        faq_id = body_data.get('id')
        question = body_data.get('question')
        answer = body_data.get('answer')
        
        cur.execute("""
            UPDATE t_p98795140_minecraft_anarchy_si.faqs
            SET question = %s, answer = %s
            WHERE id = %s
        """, (question, answer, faq_id))
        
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
    
    if method == 'DELETE':
        params = event.get('queryStringParameters', {})
        faq_id = params.get('id')
        
        cur.execute("""
            DELETE FROM t_p98795140_minecraft_anarchy_si.faqs
            WHERE id = %s
        """, (faq_id,))
        
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
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
