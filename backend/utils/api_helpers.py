import os
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from dotenv import load_dotenv
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

load_dotenv()

User = get_user_model()


GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def set_access_token(response, access_token, max_age):
    """
    Sets an access token as an HTTP-only cookie on the response.

    Parameters:
    - response (HttpResponse): The HTTP response object to set the cookie on.
    - access_token (str): The access token to store in the cookie.
    - max_age (str): If set to None, the cookie will expire when the browser is closed.

    Notes:
    - The 'secure' attribute is set to False for development. Change to True in production.
    """
    max_age = (
        settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"] if max_age is not None else max_age
    )

    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        secure=False,  # TODO: Change to True in production
        max_age=max_age,
    )


def set_refresh_token(response, refresh_token):
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=False,  # TODO: Change to True in production
        max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
    )


def google_get_tokens(code, redirect_uri):
    data = {
        "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
        "client_secret": os.environ.get("GOOGLE_CLIENT_SECRET"),
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
    }

    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

    if not response.ok:
        raise ValidationError("Failed to obtain access token from Google.")

    access_token = response.json().get("access_token")
    refresh_token = response.json().get("refresh_token")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


def google_get_user_info(access_token):
    response = requests.get(GOOGLE_USER_INFO_URL, params={"access_token": access_token})

    if not response.ok:
        raise ValidationError("Failed to obtain user info from Google.")

    return response.json()


def create_account_and_jwt_tokens(
    profile_data, provider, next_url=settings.BASE_FRONTEND_URL
):
    user_exists = User.objects.filter(email=profile_data.get("email")).exists()

    if not user_exists:
        user = User.objects.create_user(**profile_data)
        action = "signup"
    else:
        user = User.objects.get(email=profile_data["email"])
        action = "login"

    query_params = urlencode({"action": action, "provider": provider})
    refresh_obj = RefreshToken.for_user(user)
    redirect_url = f"{next_url}?{query_params}"
    response = redirect(redirect_url)

    set_access_token(response, str(refresh_obj.access_token), max_age="on")
    set_refresh_token(response, str(refresh_obj))

    return response


def get_user_groups(user):
    return list(user.groups.values_list("name", flat=True))
