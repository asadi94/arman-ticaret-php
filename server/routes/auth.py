from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, Unauthorized
from server.utils.auth_helper import generate_token
from server.utils.rate_limiter import limiter

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# کاربر ادمین پیش‌فرض (برای تست)
# در فاز بعدی به دیتابیس منتقل می‌شود
ADMIN_USER = {
    'username': 'admin',
    'password': 'admin123'  # در فاز بعدی هش می‌شود
}

@bp.route('/login', methods=['POST'])
@limiter.limit('5 per minute')
def login():
    """ورود کاربر"""
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        raise BadRequest('نام کاربری و رمز عبور الزامی است')
    
    # بررسی اعتبار (موقت - در فاز بعدی از دیتابیس می‌خوانیم)
    if data['username'] != ADMIN_USER['username'] or data['password'] != ADMIN_USER['password']:
        raise Unauthorized('نام کاربری یا رمز عبور اشتباه است')
    
    # تولید توکن
    token = generate_token(
        user_id=1,
        username=data['username'],
        role='admin'
    )
    
    return jsonify({
        'success': True,
        'data': {
            'token': token,
            'user': {
                'username': data['username'],
                'role': 'admin'
            }
        },
        'message': 'ورود با موفقیت انجام شد'
    })

@bp.route('/logout', methods=['POST'])
def logout():
    """خروج کاربر"""
    return jsonify({
        'success': True,
        'message': 'خروج با موفقیت انجام شد'
    })

@bp.route('/me', methods=['GET'])
def get_me():
    """اطلاعات کاربر فعلی"""
    # در فاز بعدی از توکن خوانده می‌شود
    return jsonify({
        'success': True,
        'data': {
            'username': 'admin',
            'role': 'admin'
        }
    })
