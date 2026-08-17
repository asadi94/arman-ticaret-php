import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ==========================================
    # SECRET_KEY – الزامی
    # ==========================================
    SECRET_KEY = os.getenv('SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("❌ SECRET_KEY در فایل .env تنظیم نشده است!")

    # ==========================================
    # دیتابیس
    # ==========================================
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///instance/arman.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ==========================================
    # آپلود
    # ==========================================
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'}

    # ==========================================
    # CORS
    # ==========================================
    CORS_ORIGINS = [origin.strip() for origin in os.getenv('CORS_ORIGINS', '').split(',') if origin.strip()]
    if not CORS_ORIGINS:
        CORS_ORIGINS = ['http://localhost:5000']

    # ==========================================
    # Rate Limiting
    # ==========================================
    RATELIMIT_DEFAULT = '100/hour'
    RATELIMIT_LOGIN = '5/minute'

    # ==========================================
    # محیط
    # ==========================================
    DEBUG = os.getenv('FLASK_ENV') == 'development'