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
    path("api/logout/", views.LogoutAPI.as_view(), name="logout_api"),
    path("api/verify-user/", views.VerifyUser.as_view(), name="verify_user"),
]
