from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from werkzeug.exceptions import Unauthorized, Forbidden

def generate_token(user_id: int, username: str, role: str) -> str:
    """تولید توکن JWT"""
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def decode_token(token: str) -> dict:
    """رمزگشایی توکن"""
    try:
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.InvalidTokenError:
        return None

def get_user_from_request():
    """دریافت کاربر از توکن موجود در Header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    return decode_token(token)

def login_required(f):
    """دکوراتور برای بررسی احراز هویت"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_user_from_request()
        if not user:
            raise Unauthorized('لطفاً وارد شوید')
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """دکوراتور برای بررسی احراز هویت ادمین"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_user_from_request()
        if not user:
            raise Unauthorized('لطفاً وارد شوید')
        
        if user.get('role') != 'admin':
            raise Forbidden('دسترسی محدود به ادمین')
        
        return f(*args, **kwargs)
    return decorated_function
