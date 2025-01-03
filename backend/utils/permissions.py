import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class JWTCustomAuthentication(BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        if access_token:
            return self._authenticate_with_access_token(access_token, refresh_token)

        if refresh_token:
            return self._authenticate_with_refresh_token(refresh_token)

        return (AnonymousUser(), None)

    def _authenticate_with_access_token(self, access_token, refresh_token):
        try:
            payload = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user = User.objects.get(id=payload.get("user_id"))
            return (user, {"access": access_token, "refresh": refresh_token})

        except jwt.ExpiredSignatureError:
            return (AnonymousUser(), None)

        except jwt.InvalidTokenError:
            return (AnonymousUser(), None)

    def _authenticate_with_refresh_token(self, refresh_token):
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            user = User.objects.get(id=refresh.payload["user_id"])
            return (user, {"access": access_token, "refresh": str(refresh)})

        except jwt.InvalidTokenError:
            return (AnonymousUser(), None)
