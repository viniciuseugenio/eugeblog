from django.contrib.auth import get_user_model
from django.urls import reverse

from bookmarks.tests.BookmarksBase import BookmarksTestBase
from utils import notifications

from ..models import Bookmarks

User = get_user_model()


class TestBookmarksViews(BookmarksTestBase):
    def test_bookmark_creation_view_return_status_code_200_OK(self):
        self.login_client("email@email.com")

        url = reverse("bookmarks:create_view", kwargs={"pk": self.post.pk})
        response = self.client.post(url)

        self.assertEqual(response.status_code, 301)

    def test_bookmark_creation_view_redirects_to_login_page_if_user_unauthenticated(
        self,
    ):
        url = reverse("bookmarks:create_view", kwargs={"pk": self.post.pk})
        response = self.client.post(url)

        self.assertEqual(response.status_code, 302)

    def test_bookmark_creation_view(self):
        self.login_client("email@email.com")

        url = reverse("bookmarks:create_view", kwargs={"pk": self.post.pk})
        response = self.client.post(url)
        were_created = Bookmarks.objects.filter(user=self.user, post=self.post).exists()

        self.assertTrue(were_created)

    def test_already_bookmarked_post_raises_error(self):
        self.login_client("email@email.com")

        # Here the post is saved to the bookmarks
        url = reverse("bookmarks:create_view", kwargs={"pk": self.post.pk})
        response = self.client.post(url)

        # We'll repeat the process to check whether it raises an error or not.
        response = self.client.post(url, follow=True)

        self.assertContains(
            response, str(notifications.ERROR["post_already_bookmarked"])
        )

    def test_bookmarks_display_view_only_shows_user_bookmarks(self):
        # Here, with an alternative user, we create a bookmark
        User.objects.create_user(
            email="email2@email.com",
            password="testCASE123.",
        )
        self.login_client("email2@email.com")
        url = reverse("bookmarks:create_view", kwargs={"pk": self.post.pk})
        response = self.client.post(url)

        """ Then, we logout and login with the principal user, and access the bookmark_list view to check
        if it contains zero posts, since we've created no post with email@email.com account and just one with email2@email.com."""
        self.client.logout()

        self.login_client("email@email.com")
        url = reverse("bookmarks:list_view")
        response = self.client.get(url)

        posts_context = response.context.get("posts")
        self.assertEqual(len(posts_context), 0)

    def test_bookmark_delete_view(self):
        self.login_client("email@email.com")

        url = reverse(
            "bookmarks:delete_view",
            kwargs={"post_pk": self.post.pk, "origin": "test"},
        )
        response = self.client.post(url)

        was_deleted = Bookmarks.objects.filter(user=self.user, post=self.post).exists()
        self.assertFalse(was_deleted)
