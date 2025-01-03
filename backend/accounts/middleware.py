from utils import api_helpers


class SetTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.path.startswith("/api"):
            if request.auth and request.user.is_authenticated:
                access_token = request.auth.get("access")
                refresh_token = request.auth.get("refresh")

                if access_token and refresh_token:
                    api_helpers.set_access_token(response, access_token, "on")
                    api_helpers.set_refresh_token(response, refresh_token)

        return response
