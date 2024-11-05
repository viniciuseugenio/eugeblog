from django.views.generic import View
from django.shortcuts import render


class PrivacyPolicy(View):
    def get(self, request, *args, **kwargs):
        return render(request, "accounts/privacy-policy.html")


class TermsOfService(View):
    def get(self, request, *args, **kwargs):
        return render(request, "accounts/terms-of-service.html")
