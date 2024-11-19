from django.urls import path
from . import views

urlpatterns = [
    path(
        "privacy-policy/", views.PrivacyPolicy.as_view(), name="account_privacy_policy"
    ),
    path(
        "terms-of-service/",
        views.TermsOfService.as_view(),
        name="account_terms_service",
    ),
    path("api/login/", views.LoginAPI.as_view(), name="login_api"),
    path(
        "api/google/login/",
        views.GoogleLoginAPI.as_view(),
        name="account_login_google_api",
    ),
    path(
        "api/github/login/",
        views.GithubLoginAPI.as_view(),
        name="account_login_github_api",
    ),
    path("api/signup/", views.SignupAPI.as_view(), name="signup_api"),
    path("api/logout/", views.LogoutAPI.as_view(), name="logout_api"),
    path("api/verify-user/", views.VerifyUser.as_view(), name="verify_user"),
]
