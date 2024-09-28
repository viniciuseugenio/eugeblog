from django.test import TestCase
from django.urls import reverse

from posts.models import Comment
from utils import notifications

from .PostBase import BasePostTest


class PostCommentTests(BasePostTest, TestCase):
    def setUp(self):
        super().setUp()
        self.post = self.create_post(self.user, "You may never doubt yourself.")

    def test_comment_view_redirects_to_home_in_get_method(self):
        self.login_client()

        url = reverse("posts:comment_view")
        expected_url = reverse("posts:list_view")
        response = self.client.get(url)

        self.assertRedirects(response, expected_url)

    def test_comment_empty_raises_error_message(self):
        self.login_client()

        url = reverse("posts:comment_view")
        response = self.client.post(
            url,
            {
                "post": self.post.id,
                "comment": "          ",
            },
            follow=True,
        )
        html_content = response.content.decode("utf-8")
        obj = Comment.objects.filter(post=self.post)

        self.assertEqual(obj.count(), 0)
        self.assertIn(str(notifications.ERROR["comment_empty"]), html_content)

    def test_comment_creation_success(self):
        self.login_client()

        url = reverse("posts:comment_view")
        comment_data = {
            "post": self.post.id,
            "comment": "This comment is good!",
        }

        response = self.client.post(
            url,
            data=comment_data,
            follow=True,
        )
        html_content = response.content.decode("utf-8")
        created_comment = Comment.objects.filter(
            post=self.post, comment=comment_data["comment"]
        )

        self.assertTrue(created_comment.exists())
        self.assertIn(str(notifications.SUCCESS["comment_created"]), html_content)
