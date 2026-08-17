from flask import Blueprint, request, jsonify
from server.utils.auth_helper import admin_required
from werkzeug.exceptions import BadRequest, NotFound
import json
import os

bp = Blueprint('content', __name__, url_prefix='/api/content')

# مسیر فایل محتوا
CONTENT_FILE = 'data/content.json'

def load_content():
    """بارگذاری محتوای سایت از فایل JSON"""
    if not os.path.exists(CONTENT_FILE):
        # محتوای پیش‌فرض
        default_content = {
            'hero': {
                'title': 'تجهیزات صنعتی مطمئن برای پروژه‌های حرفه‌ای',
                'subtitle': 'قفل‌ها، لولاها، دمپرها و یراق‌آلات صنعتی با کیفیت از برندهای معتبر جهانی',
                'button_text': 'مشاهده محصولات',
                'button_link': 'products.html'
            },
            'brands': {
                'title': 'برندهای ما',
                'subtitle': 'همکاری با برترین‌ها',
                'items': [
                    {'name': 'Atos', 'logo': 'assets/atos-logo.png', 'description': 'قفل‌ها و لولاهای صنعتی با کیفیت بالا'},
                    {'name': 'Emka', 'logo': 'assets/emka-logo.png', 'description': 'یراق‌آلات، قفل‌ها و واشرهای صنعتی'},
                    {'name': 'Siemens', 'logo': 'assets/siemens-logo.png', 'description': 'دمپرها و تجهیزات کنترل هوای صنعتی'},
                    {'name': 'Mesan', 'logo': 'assets/mesan-logo.png', 'description': 'تجهیزات و یراق‌آلات صنعتی'}
                ]
            },
            'about': {
                'title': 'درباره آرمان تجارت',
                'description': 'آرمان تجارت با تمرکز بر تأمین تجهیزات و قطعات صنعتی، تلاش می‌کند مسیر دسترسی به محصولات معتبر و مناسب برای پروژه‌های صنعتی را ساده‌تر کند.',
                'features': [
                    'محصولات برندهای معتبر',
                    'اطلاعات و تصاویر محصول',
                    'مشاوره برای انتخاب محصول',
                    'پشتیبانی و ارتباط مستقیم'
                ]
            },
            'footer': {
                'about': 'تأمین تجهیزات و قطعات صنعتی از برندهای معتبر برای پروژه‌ها و کاربردهای تخصصی.',
                'quick_links': ['صفحه اصلی', 'محصولات', 'برندها', 'تماس با ما'],
                'brands': ['Atos', 'Emka', 'Siemens', 'Mesan'],
                'phones': ['+98 912 729 8756', '+90 535 546 3391', '+49 201 520 90071']
            }
        }
        os.makedirs(os.path.dirname(CONTENT_FILE), exist_ok=True)
        with open(CONTENT_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_content, f, ensure_ascii=False, indent=2)
        return default_content
    
    with open(CONTENT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_content(data):
    """ذخیره محتوای سایت در فایل JSON"""
    os.makedirs(os.path.dirname(CONTENT_FILE), exist_ok=True)
    with open(CONTENT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@bp.route('/', methods=['GET'])
def get_content():
    """دریافت محتوای سایت"""
    content = load_content()
    return jsonify({
        'success': True,
        'data': content
    })

@bp.route('/', methods=['PUT'])
@admin_required
def update_content():
    """به‌روزرسانی محتوای سایت"""
    data = request.get_json()
    
    if not data:
        raise BadRequest('داده‌های محتوا ارسال نشده است')
    
    # بارگذاری محتوای فعلی
    current_content = load_content()
    
    # به‌روزرسانی فیلدها
    for key, value in data.items():
        if key in current_content:
            current_content[key] = value
    
    save_content(current_content)
    
    return jsonify({
        'success': True,
        'data': current_content,
        'message': 'محتوای سایت با موفقیت به‌روزرسانی شد'
    })
