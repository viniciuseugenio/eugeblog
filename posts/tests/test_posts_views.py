from django.test import TestCase
from django.urls import reverse


class PostViewsTests(TestCase):
    def test_list_view_returns_status_200_OK(self):
        response = self.client.get(reverse("posts:list_view"))
        self.assertEqual(response.status_code, 200)

    def test_list_view_returns_correct_template(self):
        response = self.client.get(reverse("posts:list_view"))
        self.assertTemplateUsed(response, "posts/index.html")
