import os
import magic
from werkzeug.utils import secure_filename
from flask import current_app
from werkzeug.exceptions import BadRequest

def get_allowed_extensions():
    return current_app.config.get('ALLOWED_EXTENSIONS', set())

def get_mime_map():
    return {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'mp4': 'video/mp4',
        'webm': 'video/webm',
    }

def validate_file(file):
    """اعتبارسنجی کامل فایل آپلودی"""
    if not file or file.filename == '':
        raise BadRequest('هیچ فایلی انتخاب نشده است')
    
    # ۱. بررسی پسوند
    extension = file.filename.rsplit('.', 1)[-1].lower()
    if extension not in get_allowed_extensions():
        raise BadRequest(f'پسوند {extension} مجاز نیست. پسوندهای مجاز: {", ".join(get_allowed_extensions())}')
    
    # ۲. بررسی MIME Type واقعی
    file_content = file.read(1024)
    file.seek(0)
    
    mime_type = magic.from_buffer(file_content, mime=True)
    expected_mime = get_mime_map().get(extension)
    
    if not expected_mime or mime_type != expected_mime:
        raise BadRequest(f'نوع فایل {mime_type} با پسوند {extension} مطابقت ندارد')
    
    # ۳. بررسی حجم فایل
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    
    max_size = current_app.config.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)
    if size > max_size:
        raise BadRequest(f'حجم فایل باید کمتر از {max_size // (1024 * 1024)}MB باشد')
    
    return True

def save_file(file, subfolder=''):
    """ذخیره فایل با نام امن"""
    validate_file(file)
    
    filename = secure_filename(file.filename)
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], subfolder)
    os.makedirs(upload_path, exist_ok=True)
    
    # ایجاد نام یکتا برای جلوگیری از تداخل
    name, ext = filename.rsplit('.', 1)
    unique_filename = f"{name}_{os.urandom(4).hex()}.{ext}"
    file_path = os.path.join(upload_path, unique_filename)
    
    file.save(file_path)
    return unique_filename
