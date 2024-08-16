from allauth.account.forms import SignupForm
from django import forms
from django.utils.translation import gettext_lazy as _


class CustomSignupForm(SignupForm):
    first_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "type": "text",
                "placeholder": " ",
                "autocomplete": "given-name",
            }
        )
    )

    last_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "type": "text",
                "placeholder": " ",
                "autocomplete": "given-name",
            }
        )
    )

    def __init__(self, *args, **kwargs):
        super(CustomSignupForm, self).__init__(*args, **kwargs)

        default_field_order = [
            "email",
            "first_name",
            "last_name",
            "password1",
            "password2",
        ]

    def save(self, request):
        user = super(CustomSignupForm, self).save(request)

        user.first_name = self.cleaned_data.get("first_name")
        user.last_name = self.cleaned_data.get("last_name")
        user.save()

        return user
