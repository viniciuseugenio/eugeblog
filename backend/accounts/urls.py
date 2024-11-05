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
]
