from django.urls import path
from ..views import api

app_name = "accounts"

urlpatterns = [
    path(
        "login/google/",
        api.GoogleLogin.as_view(),
        name="login_google",
    ),
    path(
        "login/github/",
        api.GithubLogin.as_view(),
        name="login_github",
    ),
    path("signup/", api.Signup.as_view(), name="signup"),
    path("logout/", api.Logout.as_view(), name="logout"),
]
