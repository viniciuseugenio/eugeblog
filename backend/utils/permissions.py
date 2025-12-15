import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from posts.models import Post
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.exceptions import TokenError
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

    def _authenticate_with_access_token(self, access_token):
        try:
            payload = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user = User.objects.get(id=payload.get("user_id"))
            return (user, None)

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return (AnonymousUser(), None)

    def _authenticate_with_refresh_token(self, refresh_token):
        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get("user_id")
            if not user_id:
                return (AnonymousUser(), None)

            user = User.objects.get(id=user_id)
            return (user, None)

        except (jwt.InvalidTokenError, TokenError):
            return (AnonymousUser(), None)


class IsOwnerOrPostReviewer(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        pk = view.kwargs.get("pk")
        obj = Post.objects.get(pk=pk)

        is_reviewer = user.groups.filter(name="post_reviewer").exists()
        is_owner = obj.author.id == user.id

        if not is_owner and not is_reviewer:
            raise PermissionDenied(
                "You do not have permission to perform any action in this post."
            )

        return True

    def has_object_permission(self, request, view, obj):
        user = request.user

        is_reviewer = user.groups.filter(name="post_reviewer").exists()
        is_owner = obj.author.id == user.id

        if not is_owner and not is_reviewer:
            raise PermissionDenied(
                "You do not have permission to perform any action in this post."
            )

        return True


class IsPostReviewer(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        is_reviewer = user.groups.filter(name="post_reviewer").exists()

        if not is_reviewer:
            raise PermissionDenied(
                "You do not have permission to perform any action in this post."
            )

        return True
