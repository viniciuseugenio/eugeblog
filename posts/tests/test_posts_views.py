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
        self.user2 = self.create_user("email2@email.com", is_post_reviewer=False)

    def get_url(self, pk):
        return reverse("posts:details_view", kwargs={"pk": pk})

    def test_list_view_returns_status_200_OK(self):
        response = self.client.get(reverse("posts:list_view"))
        self.assertEqual(response.status_code, 200)

    def test_list_view_returns_correct_template(self):
        response = self.client.get(reverse("posts:list_view"))
        self.assertTemplateUsed(response, "posts/index.html")

    def test_details_view_returns_status_200_OK(self):
        url = self.get_url(self.post.pk)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_details_view_returns_correct_template(self):
        url = self.get_url(self.post.pk)
        response = self.client.get(url)
        self.assertTemplateUsed(response, "posts/details.html")

    def test_post_details_show_action_buttons_if_user_is_the_author(self):
        self.login_client("email@email.com")

        url = self.get_url(self.post.pk)
        response = self.client.get(url)

        self.assertContains(response, 'class="post-actions"')

    def test_post_details_show_action_buttons_if_user_is_not_the_author(self):
        # Login client with user that is not author of self.post
        self.login_client("email2@email.com")

        url = self.get_url(self.post.pk)
        response = self.client.get(url)

        self.assertNotContains(response, 'class="post-actions"')

    def test_post_details_view_creates_history_session_if_doesnt_exist(self):
        self.assertFalse(self.client.session.get("history"))

        url = self.get_url(self.post.pk)
        self.client.get(url)

        self.assertTrue(self.client.session.get("history"))

    def test_post_details_view_sets_current_post_as_first_in_history_session(self):
        posts = [
            self.create_post(self.user, "Lorem ipsum dolor sit amet") for _ in range(5)
        ]

        for post in posts:
            self.client.get(self.get_url(post.pk))

        last_item = self.client.session["history"][-1]
        self.client.get(self.get_url(self.post.pk))

        self.assertEqual(self.client.session["history"][0], self.post.pk)
        self.assertNotIn(last_item, self.client.session["history"])

    def test_details_view_history_has_maximum_of_5_items(self):
        posts = [
            self.create_post(self.user, "Lorem ipsum dolor sit amet") for _ in range(6)
        ]

        for post in posts:
            self.client.get(self.get_url(post.pk))

        self.client.get(self.get_url(self.post.pk))

        self.assertEqual(len(self.client.session["history"]), 5)

    def test_details_view_history_place_existing_items_in_first_position(
        self,
    ):
        posts = [
            self.create_post(self.user, "Lorem ipsum dolor sit amet") for _ in range(5)
        ]

        for post in posts:
            self.client.get(self.get_url(post.pk))

        self.assertEqual(self.client.session["history"][2], posts[2].pk)

        self.client.get(self.get_url(posts[2].pk))
        self.assertEqual(self.client.session["history"][0], posts[2].pk)

    def test_post_details_create_context_to_display_history(self):
        posts = [
            self.create_post(self.user, "Lorem ipsum dolor sit amet") for _ in range(5)
        ]

        for post in posts:
            self.client.get(self.get_url(post.pk))

        response = self.client.get(self.get_url(self.post.pk))

        self.assertTrue(response.context["history_objs"])

    def test_post_delete_view_successfuly_deletes_post(self):
        self.login_client()

        url = reverse("posts:delete_view", kwargs={"pk": self.post.pk})
        self.client.post(url)
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
