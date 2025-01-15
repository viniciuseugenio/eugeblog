import os
from urllib.parse import urlencode

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.urls import reverse
from dotenv import load_dotenv
from rest_framework import serializers, status
from rest_framework.compat import requests
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from utils import api_helpers

from ..api.serializers import UserSerializer

load_dotenv()

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.user
        remember = request.data.get("remember")

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        response = Response(
            {"detail": "You have successfully logged in!", "user_id": user.id},
            status=status.HTTP_200_OK,
        )
        max_age = (settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"] if remember else None,)

        api_helpers.set_access_token(response, access_token, max_age)

        if remember:
            api_helpers.set_refresh_token(response, str(refresh))

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "No refresh token found in the request."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)

            response = Response(
                {"detail": "Access token refreshed!"}, status=status.HTTP_200_OK
            )
            api_helpers.set_access_token(response, new_access_token, max_age=True)

            return response

        except Exception:
            return Response(
                {"detail": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST
            )


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        token = request.COOKIES.get("access_token")

        if not token:
            return Response(
                {"detail": "No access token found in the request."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            return Response(
                {"detail": "Token is valid.", "user_id": user_id},
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )


class Signup(APIView):
    def post(self, request):
        request.data["agree"] = "off" if request.data.get("agree") is None else "on"
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User created!"}, status=status.HTTP_201_CREATED)

        return Response(
            {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


class Logout(APIView):
    def post(self, request):
        response = Response(
            {"detail": "You have successfully logged out!"}, status=status.HTTP_200_OK
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        # Set request as None so the middleware don't set the cookies back
        request.auth = None

        return response


class GoogleLogin(APIView):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def get(self, request, *args, **kwargs):
        next_url = request.GET.get("state")

        if next_url:
            next_url = f"{settings.BASE_FRONTEND_URL}{next_url}"
        else:
            next_url = settings.BASE_FRONTEND_URL

        input_serializer = self.InputSerializer(data=request.GET)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get("code")
        error = validated_data.get("error")

        login_url = f"{settings.BASE_FRONTEND_URL}/login/"

        if error or not code:
            params = urlencode({"error": error})
            return redirect(f"{login_url}?{params}")

        domain = settings.BASE_BACKEND_URL
        api_uri = reverse("accounts:login_google")
        redirect_uri = f"{domain}{api_uri}"

        try:

            tokens = api_helpers.google_get_tokens(code=code, redirect_uri=redirect_uri)
            user_data = api_helpers.google_get_user_info(
                access_token=tokens["access_token"]
            )
        except ValidationError:
            return redirect(f"{login_url}?error=access_token")

        profile_data = {
            "email": user_data["email"],
            "first_name": user_data.get("given_name", ""),
            "last_name": user_data.get("family_name", ""),
        }

        return api_helpers.create_account_and_jwt_tokens(
            profile_data, "Google", next_url
        )


class GithubLogin(APIView):
    def get(self, request, *args, **kwargs):
        next_url = request.GET.get("state")

        if next_url:
            next_url = f"{settings.BASE_FRONTEND_URL}{next_url}"
        else:
            next_url = settings.BASE_FRONTEND_URL

        code = request.GET.get("code")

        url = "https://github.com/login/oauth/access_token"
        payload = {
            "client_id": os.environ.get("GITHUB_CLIENT_ID"),
            "client_secret": os.environ.get("GITHUB_CLIENT_SECRET"),
            "code": code,
        }
        headers = {"Accept": "application/json"}

        response = requests.post(url, data=payload, headers=headers)
        access_token = response.json().get("access_token")

        # Retrieve user primary e-mail
        email_url = "https://api.github.com/user/emails"
        email_headers = {"Authorization": f"Bearer {access_token}"}
        email_response = requests.get(email_url, headers=email_headers)

        if email_response.status_code != 200:
            error_message = urlencode({"error": "email_fetching"})
            return redirect(f"{settings.BASE_FRONTEND_URL}/login?{error_message}")

        emails = email_response.json()
        primary_email = next(
            (email["email"] for email in emails if email["primary"]), None
        )

        if not primary_email:
            return Response(
                {"detail": "No primary e-mail found in GitHub account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile_data = {
            "email": primary_email,
            "first_name": "",
            "last_name": "",
        }

        return api_helpers.create_account_and_jwt_tokens(
            profile_data, "GitHub", next_url
        )
