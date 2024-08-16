from django.test import TestCase
from django.urls import reverse
from allauth.socialaccount.models import SocialApp
from dotenv import load_dotenv
import os

load_dotenv()


def create_social_apps():
    SocialApp.objects.create(
        provider="google",
        name="Google",
        client_id=os.environ.get("GOOGLE_CLIENT_ID"),
        secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    )

    SocialApp.objects.create(
        provider="github",
        name="GitHub",
        client_id=os.environ.get("GITHUB_CLIENT_ID"),
        secret=os.environ.get("GITHUB_CLIENT_SECRET"),
    )


class AccountsViewsTests(TestCase):
    def setUp(self):
        create_social_apps()

    def test_account_terms_of_service_page_returns_status_200_OK(self):
        response = self.client.get(reverse("account_terms_service"))
        self.assertEqual(response.status_code, 200)

    def test_account_terms_of_service_page_template_is_correct(self):
        response = self.client.get(reverse("account_terms_service"))
        self.assertTemplateUsed(response, "accounts/terms-of-service.html")

    def test_account_privacy_policy_page_returns_status_200_OK(self):
        response = self.client.get(reverse("account_privacy_policy"))
        self.assertEqual(response.status_code, 200)

    def test_account_privacy_policy_page_template_is_correct(self):
        response = self.client.get(reverse("account_privacy_policy"))
        self.assertTemplateUsed("accounts/privacy-policy.html")

    def test_account_login_page_returns_status_200_OK(self):
        response = self.client.get(reverse("account_login"))
        self.assertEqual(response.status_code, 200)

    def test_account_login_page_template_is_correct(self):
        response = self.client.get(reverse("account_login"))
        self.assertTemplateUsed(response, "account/login.html")

    def test_account_register_page_template_is_correct(self):
        response = self.client.get(reverse("account_signup"))
        self.assertTemplateUsed(response, "account/signup.html")

    def test_account_register_page_returns_status_200_OK(self):
        response = self.client.get(reverse("account_signup"))
        self.assertEqual(response.status_code, 200)
