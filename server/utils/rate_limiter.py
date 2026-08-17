from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Limiter instance (در app.py مقداردهی می‌شود)
limiter = None

def init_limiter(app):
    global limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[app.config.get('RATELIMIT_DEFAULT', '100/hour')],
        storage_uri="memory://"
    )
    return limiter
