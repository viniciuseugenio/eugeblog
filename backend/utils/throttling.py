from rest_framework.throttling import SimpleRateThrottle


class EmailBasedThrottle(SimpleRateThrottle):
    scope = "password_reset"

    def get_cache_key(self, request, view):
        email = request.data.get("email")
        if email:
            return f"password_reset_{email}"
        return None
