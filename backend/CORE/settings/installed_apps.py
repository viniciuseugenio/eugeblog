DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    "rest_framework",
]

PROJECT_APPS = [
    "accounts",
    "bookmarks",
    "posts",
]

EXTERNAL_APPS = [
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.github",
    "django_summernote",
    "corsheaders",
]

INSTALLED_APPS = DJANGO_APPS + PROJECT_APPS + EXTERNAL_APPS
