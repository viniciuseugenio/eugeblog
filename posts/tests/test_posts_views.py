from django.test import TestCase
from django.urls import reverse
from posts.models import Post
from django.contrib.auth import get_user_model

User = get_user_model()


class PostViewsTests(TestCase):
    def setUp(self):
        user = User.objects.create(
            email="email@email.com",
            first_name="Test",
            last_name="Case",
            password="testCASE123.",
        )

        Post.objects.create(
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
        response = self.client.get(reverse("posts:details_view", kwargs={"pk": 1}))
        self.assertTemplateUsed(response, "posts/details.html")
