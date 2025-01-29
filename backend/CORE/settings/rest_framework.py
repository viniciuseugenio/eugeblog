import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 28,
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "utils.permissions.JWTCustomAuthentication",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "password_reset": "3/hour",
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "SIGNING_KEY": os.environ.get("SECRET_KEY"),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]
