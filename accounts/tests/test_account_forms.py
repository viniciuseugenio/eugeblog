from django.test import TestCase, RequestFactory
from accounts.forms import CustomSignupForm
from django.urls import reverse, resolve


class AccountsFormsTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_form_signup_returns_user_with_names(self):
        request = self.factory.get(reverse("account_signup"))
        request.session = {}

        first_name = "Vinicius"
        last_name = "Eugenio"

        form = CustomSignupForm(
            data={
                "email": "viniciuseugeniovhe@gmail.com",
                "first_name": f"{first_name}",
                "last_name": f"{last_name}",
                "password1": "testADM1",
                "password2": "testADM2",
            }
        )

        form.is_valid()

        user = form.save(request)
        self.assertEqual([user.first_name, user.last_name], [first_name, last_name])
