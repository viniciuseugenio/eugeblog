from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from posts.models import Post
from utils import notifications

from .PostBase import BasePostTest

User = get_user_model()


class PostViewsTests(BasePostTest, TestCase):
    def setUp(self):
        super().setUp()

        self.post = self.create_post(self.user, "Lorem ipsum dolor sit amet.")
        self.user2 = self.create_user("email2@email.com")

    def test_list_view_returns_status_200_OK(self):
        response = self.client.get(reverse("posts:list_view"))
        self.assertEqual(response.status_code, 200)

    def test_list_view_returns_correct_template(self):
        response = self.client.get(reverse("posts:list_view"))
        self.assertTemplateUsed(response, "posts/index.html")

    def test_details_view_returns_status_200_OK(self):
        response = self.client.get(reverse("posts:details_view", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, 200)

    def test_details_view_returns_status_200_OK(self):
        url = reverse("posts:details_view", kwargs={"pk": self.post.pk})
        response = self.client.get(url)
        self.assertTemplateUsed(response, "posts/details.html")

    def test_post_details_show_action_buttons_if_user_is_the_author(self):
        self.login_client("email@email.com")

        url = reverse("posts:details_view", kwargs={"pk": self.post.pk})
        response = self.client.get(url)

        self.assertContains(response, 'class="post-actions"')

    def test_post_details_show_action_buttons_if_user_is_not_the_author(self):
        # Login client with user that is not author of self.post
        self.login_client("email2@email.com")

        url = reverse("posts:details_view", kwargs={"pk": self.post.pk})
        response = self.client.get(url)

        self.assertNotContains(response, 'class="post-actions"')

    def test_post_delete_view_successfuly_deletes_post(self):
        self.login_client()

        url = reverse("posts:delete_view", kwargs={"pk": self.post.pk})
        response = self.client.post(url)
        post_exists = Post.objects.filter(pk=self.post.pk).exists()

        self.assertFalse(post_exists)

    def test_post_delete_view_displays_message_if_user_not_author(self):
        # Login client with user that is not author of self.post
        self.login_client("email2@email.com")

        url = reverse("posts:delete_view", kwargs={"pk": self.post.pk})
        response = self.client.post(url, follow=True)

        self.assertContains(response, str(notifications.ERROR["not_post_author"]))

    def test_search_view(self):
        self.create_post(self.user, "You have to believe in yourself")
        self.create_post(self.user, "You don't need to martyrize yourself")

        url = reverse("posts:list_view") + "?q=believe"
        response = self.client.get(url)

        self.assertContains(response, "believe")
        self.assertNotContains(response, "martyrize")
