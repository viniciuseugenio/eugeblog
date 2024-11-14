import os
import jwt
from dotenv import load_dotenv
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model


from posts.models import Post

load_dotenv()

User = get_user_model()


def get_user_id(token):
    try:
        decoded = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
        return decoded.get("user_id")
    except (jwt.DecodeError, jwt.InvalidTokenError):
        return 0


def check_if_is_allowed_to_edit(token, post_id):
    try:
        user_id = get_user_id(token)
        user_obj = User.objects.get(pk=user_id)
        post_obj = Post.objects.get(pk=post_id)

        is_post_reviewer = user_obj.groups.filter(name="post_reviewer").exists()
        is_owner = post_obj.author.id == user_id

        return is_post_reviewer or is_owner

    except (jwt.ExpiredSignatureError, jwt.DecodeError, jwt.InvalidTokenError):
        return False


def set_access_token(response, access_token, max_age):
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


def check_authentication(request, response):
    refresh_token = request.COOKIES.get("refresh_token")
    access_token = request.COOKIES.get("access_token")

    if access_token:
        response.data["authenticated"] = True

        return {
            "response": response,
            "authenticated": True,
            "user_id": get_user_id(access_token),
            "access_token": access_token,
        }

    if refresh_token:
        try:
            refresh = RefreshToken(refresh_token)

            set_access_token(response, refresh.access_token, "on")
            set_refresh_token(response, str(refresh))
            response.data["authenticated"] = True

            return {
                "response": response,
                "authenticated": True,
                "user_id": get_user_id(refresh.access_token),
                "access_token": refresh.access_token,
            }

        except jwt.InvalidTokenError:
            pass

    return {"response": response, "authenticated": False, "user_id": 0}
