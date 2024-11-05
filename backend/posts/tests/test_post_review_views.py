from .PostBase import BasePostTest

from django.urls import reverse
from django.test import TestCase


class TestPostReviewViews(BasePostTest, TestCase):
    def setUp(self):
        super().setUp()

        self.post1 = self.create_post(self.user, "Post 1")
        self.post2 = self.create_post(self.user, "Post 2")

        # Set post2 is_published as False
        self.post2.is_published = False
        self.post2.save()

        # Login client by default
        self.login_client()

        # Create alternative user
        self.user2 = self.create_user("email2@email.com", is_post_reviewer=False)

    def login_alternative_user(self):
        self.client.logout()
        self.login_client("email2@email.com")

    def test_posts_review_list_view_returns_status_code_200_OK(self):
        url = reverse("posts:review_list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_posts_review_list_view_redirects_user_when_not_post_reviewer(self):
        self.login_alternative_user()

        url = reverse("posts:review_list")
        response = self.client.get(url)

        self.assertRedirects(response, reverse("posts:list_view"))

    def test_posts_review_list_view_displays_only_posts_that_arent_published(self):
        url = reverse("posts:review_list")
        response = self.client.get(url, follow=True)

        self.assertEqual(len(response.context["posts"]), 1)

    def test_post_review_details_view_returns_status_code_200_OK(self):
        url = reverse("posts:review_details", kwargs={"pk": self.post2.pk})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_post_review_details_redirects_user_when_not_post_reviewer_nor_author(self):
        self.login_alternative_user()

        url = reverse("posts:review_details", kwargs={"pk": self.post2.pk})
        response = self.client.get(url)

        self.assertRedirects(response, reverse("posts:list_view"))

    def test_post_review_details_view_redirects_user_when_not_post_reviewer(self):
        self.login_alternative_user()

        url = reverse("posts:review_details", kwargs={"pk": self.post2.pk})
        response = self.client.get(url)

        self.assertRedirects(response, reverse("posts:list_view"))

    def test_post_review_details_does_not_redirects_when_user_is_post_author_but_not_reviewer(
        self,
    ):
        self.login_alternative_user()

        # Make alternative user as author of alternative post
        self.post2.author = self.user2
        self.post2.save()

        url = reverse("posts:review_details", kwargs={"pk": self.post2.pk})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_post_review_details_buttons_returns_message_when_user_is_just_author(self):
        self.login_alternative_user()

        self.post2.author = self.user2
        self.post2.save()

        url = reverse("posts:review_details", kwargs={"pk": self.post2.pk})
        response = self.client.get(url)
        content = response.content.decode("utf-8")

        self.assertIn(
            "This post is under review. Please wait for the authorization.", content
        )

    def test_post_review_details_shows_buttons_when_user_is_post_reviewer(self):
        url = reverse("posts:review_details", kwargs={"pk": self.post2.pk})
        response = self.client.get(url)
        content = response.content.decode("utf-8")

        self.assertIn("Authorize post", content)

    def test_post_review_details_redirects_to_details_is_post_is_published(self):
        url = reverse("posts:review_details", kwargs={"pk": self.post1.pk})
        response = self.client.get(url)
        expected_url = reverse("posts:details_view", kwargs={"pk": self.post1.pk})

        self.assertRedirects(response, expected_url)

    def test_post_review_allow_post_publishes_post(self):
        url = reverse("posts:review_allow", kwargs={"pk": self.post2.pk})
        response = self.client.post(url, follow=True)
        post = response.context["post"]

        self.assertTrue(post.is_published)

    def test_post_review_allow_redirects_to_post_details(self):
        url = reverse("posts:review_allow", kwargs={"pk": self.post2.pk})

        response = self.client.post(url)
        expected_url = reverse("posts:details_view", kwargs={"pk": self.post2.pk})

        self.assertRedirects(response, expected_url)

    def test_post_review_redirects_to_review_list_if_request_method_isnt_post(self):
        url = reverse("posts:review_allow", kwargs={"pk": self.post2.pk})

        response = self.client.get(url)
        expected_url = reverse("posts:review_list")

        self.assertRedirects(response, expected_url)
