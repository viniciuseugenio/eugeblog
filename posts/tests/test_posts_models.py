from django.test import TestCase
from django.urls import reverse

from posts import models

from .PostBase import BasePostTest


class PostModelsTests(BasePostTest, TestCase):
    def setUp(self):
        super().setUp()

        self.title = "You may never doubt yourself."
        self.post = self.create_post(self.user, self.title)

    def test_post_verbose_name_method(self):
        self.assertEqual(str(self.post), self.title)

    def test_post_absolute_url(self):
        url = reverse("posts:details_view", kwargs={"pk": self.post.pk})
        self.assertEqual(self.post.get_absolute_url(), url)

    def test_category_verbose_name_method(self):
        category_title = "Investment"
        category = models.Category.objects.create(name=category_title)

        self.assertEqual(str(category), category_title)

    def test_comment_verbose_name_plural(self):
        comment = models.Comment.objects.create(
            author=self.user, post=self.post, comment="Test comment"
        )

        comment_verbose = f"{comment.author} - {comment.post} ({comment.post.pk})"
        self.assertEqual(str(comment), comment_verbose)
