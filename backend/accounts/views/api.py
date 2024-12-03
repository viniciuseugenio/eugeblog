import os
from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import redirect
from django.urls import reverse
from dotenv import load_dotenv
from rest_framework import serializers, status
from rest_framework.compat import requests
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from utils import api_helpers

from ..serializers import UserSerializer

load_dotenv()

User = get_user_model()


class VerifyUser(APIView):
    def get(self, request):
        base_response = Response({"authenticated": False})

        auth_info = api_helpers.check_authentication(request, base_response)

        auth_response = auth_info.get("response")
        return auth_response


class LoginAPI(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        remember = request.data.get("remember")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response = Response(
                {"success": "You have successfully logged in!"},
                status=status.HTTP_200_OK,
            )

            api_helpers.set_access_token(response, access_token, max_age=remember)

            if remember:
                api_helpers.set_refresh_token(response, str(refresh))

            return response

        else:
            return Response(
                {
                    "error": "The e-mail and password you provided did not match any of our records. Please, try again."
                },
                status=401,
            )


class SignupAPI(APIView):
    def post(self, request):
        request.data["agree"] = "off" if request.data.get("agree") is None else "on"
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created!"}, status=status.HTTP_202_CREATED
            )

        print(serializer.errors)
        return Response(
            {"errors": serializer.errors}, status=status.HTTP_401_BAD_REQUEST
        )


class LogoutAPI(APIView):
    def post(self, request):

        response = Response(
            {"detail": "You have successfully logged out!"}, status=status.HTTP_200_OK
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class GoogleLoginAPI(APIView):
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

        login_url = f"{settings.BASE_FRONTEND_URL}/login"

        if error or not code:
            params = urlencode({"error": error})
            return redirect(f"{login_url}?{params}")

        domain = settings.BASE_BACKEND_URL
        api_uri = reverse("account_login_google_api")
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


class GithubLoginAPI(APIView):
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
                {"error": "No primary e-mail found in GitHub account."},
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
