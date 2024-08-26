import os

from django.test import TestCase
from django.urls import reverse
from posts.models import Post, Comment
from django.contrib.auth import get_user_model
from django.conf import settings


from templates.static import notifications

User = get_user_model()


class PostViewsTests(TestCase):
    def setUp(self):
        image_path = os.path.join(settings.BASE_DIR, "media/coffee.jpg")

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
            image="media/coffee.jpg",
            is_published=True,
        )

        self.form_data = {
            "title": "Lorem ipsum dolor sit amet",
            "excerpt": "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ipsam incidunt praesentium accusantium veritatis ut ea esse laboriosam nulla, aliquid sapiente saepe distinctio officia eos placeat. Dicta ipsa ipsum velit.",
            "image": open(image_path, "rb"),
        }

    def login_client(self):
        self.client.login(email="email@email.com", password="testCASE123.")

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
