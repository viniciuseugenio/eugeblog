import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission
from rest_framework.response import Response

from . import api_helpers

User = get_user_model()


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            return None

        try:
            payload = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user = User.objects.get(id=payload.get("user_id"))
            return (user, None)

        except jwt.ExpiredSignatureError:
            return AuthenticationFailed("The access token expired")

        except jwt.InvalidTokenError:
            return AuthenticationFailed("Invalid access token")


class IsAuthenticatedUser(BasePermission):
    message = "You have to be logged in to take this action."

    def has_permission(self, request, view):
        response = api_helpers.check_authentication(request, Response({}))
        request.auth_response = response

        if not response.data.get("authenticated"):
            return False

        user_id = response.data.get("user_id")

        try:
            user = User.objects.get(id=user_id)
            request.user = user
        except User.DoesNotExist:
            return False

        return True
