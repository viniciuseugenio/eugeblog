from django.test import TestCase
from django.urls import reverse

from posts.models import Post
from utils import notifications

from .PostBase import BasePostTest


class PostCreationTests(BasePostTest, TestCase):
    def test_post_creation_view_returns_status_200_OK(self):
        self.login_client()

        url = reverse("posts:create_view")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_post_creation_forms_title_short_of_then_character_error(self):
        self.login_client()

        url = reverse("posts:create_view")
        self.form_data["title"] = "123456789"
        response = self.client.post(url, self.form_data, follow=True)
        content = response.content.decode("utf-8")

        self.assertIn(
            str(notifications.ERROR["creation_post_title_short_of_ten_characters"]),
            content,
        )

    def test_post_creation_forms_title_equal_excerpt_raises_error(self):
        self.login_client()

        url = reverse("posts:create_view")
        self.form_data["title"] = (
            "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        )
        self.form_data["excerpt"] = (
            "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        )

        response = self.client.post(url, self.form_data, follow=True)
        content = response.content.decode("utf-8")

        self.assertIn(
            str(notifications.ERROR["creation_post_title_equal_excerpt"]),
            content,
        )

    def test_post_creation_success(self):
        self.login_client()

        url = reverse("posts:create_view")
        response = self.client.post(
            url,
            data=self.form_data,
            follow=True,
        )

        content = response.content.decode("utf-8")

        post_created = Post.objects.filter(title=self.form_data["title"])

        self.assertIn(str(notifications.SUCCESS["post_created"]), content)
        self.assertTrue(post_created.exists())
