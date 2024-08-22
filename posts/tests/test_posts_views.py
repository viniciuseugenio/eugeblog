from django.test import TestCase
from django.urls import reverse
from posts.models import Post, Comment
from django.contrib.auth import get_user_model

from templates.static import notifications

User = get_user_model()


class PostViewsTests(TestCase):
    def setUp(self):
        user = User.objects.create_user(
            email="email@email.com",
            first_name="Test",
            last_name="Case",
            password="testCASE123.",
        )

        self.post = Post.objects.create(
            author=user,
            title="Lorem ipsum dolor sit amet.",
            excerpt="Lorem ipsum dolor sit amet.",
            content="Lorem ipsum dolor sit amet.",
            image="media/coffee.png",
            is_published=True,
        )

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

    def test_comment_view_redirects_to_home_in_get_method(self):
        self.client.login(email="email@email.com", password="testCASE123.")

        url = reverse("posts:comment_view")
        expected_url = reverse("posts:list_view")
        response = self.client.get(url)

        self.assertRedirects(response, expected_url)

    def test_comment_empty_raises_error_message(self):
        self.client.login(email="email@email.com", password="testCASE123.")

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

    def test_comment_creation(self):
        self.client.login(email="email@email.com", password="testCASE123.")

        url = reverse("posts:comment_view")
        response = self.client.post(
            url,
            {
                "post": self.post.id,
                "comment": "This comment is good!",
            },
            follow=True,
        )
        html_content = response.content.decode("utf-8")
        obj = Comment.objects.filter(post=self.post)

        self.assertEqual(obj.count(), 1)
        self.assertIn(str(notifications.SUCCESS["comment_created"]), html_content)
