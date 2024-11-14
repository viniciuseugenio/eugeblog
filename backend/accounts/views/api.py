from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import status
from utils import api_helpers


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
            access_token = refresh.access_token

            response = JsonResponse({"success": "You have successfully logged in!"})

            api_helpers.set_access_token(response, access_token, max_age=remember)

            if remember:
                api_helpers.set_refresh_token(response, str(refresh))

            return response

        else:
            return JsonResponse(
                {
                    "error": "The e-mail and password you provided did not match any of our records. Please, try again."
                },
                status=401,
            )


class LogoutAPI(APIView):
    def post(self, request):
        response = JsonResponse({"detail": "You have successfully logged out!"})

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response
