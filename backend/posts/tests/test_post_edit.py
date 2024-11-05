from django.test import TestCase
from django.urls import reverse

from posts.models import Post
from utils import notifications

from .PostBase import BasePostTest


class PostEditTest(BasePostTest, TestCase):
    def setUp(self):
        super().setUp()
        self.post = self.create_post(self.user, "You may never doubt yourself.")

        self.create_user("email2@email.com", is_post_reviewer=False)

    def test_post_edit_view_returns_status_200_OK(self):
        self.login_client()

        url = reverse("posts:edit_view", kwargs={"pk": self.post.pk})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_post_edit_view_redirects_if_user_not_author_nor_post_reviewer(self):
        self.login_client("email2@email.com")

        url = reverse("posts:edit_view", kwargs={"pk": self.post.pk})
        response = self.client.get(url, follow=True)
        content = response.content.decode("utf-8")
        expected_url = reverse("posts:list_view")

        self.assertRedirects(response, expected_url)
        self.assertIn(str(notifications.ERROR["not_post_author"]), content)

    def test_post_edit_view_sends_post_to_review_if_edited(self):
        self.login_client()

        url = reverse("posts:edit_view", kwargs={"pk": self.post.pk})
        self.form_data["title"] = f"{self.post.title} (Edited!)"
        self.client.post(url, data=self.form_data, follow=True)
        edited_post = Post.objects.get(pk=self.post.pk)

        self.assertEqual(edited_post.is_published, False)

    def test_post_edit_view_does_not_sends_post_to_review_if_not_edited(self):
        self.login_client()

        url = reverse("posts:edit_view", kwargs={"pk": self.post.pk})
        self.client.post(url, data=self.form_data, follow=True)
        edited_post = Post.objects.get(pk=self.post.pk)

        self.assertEqual(edited_post.is_published, True)
