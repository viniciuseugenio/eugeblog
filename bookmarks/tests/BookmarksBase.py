import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase

from posts.models import Post

User = get_user_model()


class BookmarksTestBase(TestCase):
    def setUp(self):
        email = "email@email.com"
        password = "testCASE123."

        self.user = User.objects.create_user(
            email=email,
            first_name="Test",
            last_name="Case",
            password=password,
        )

        image_path = os.path.join(settings.BASE_DIR, "media/coffee.jpg")
        self.post = Post.objects.create(
            image=image_path,
            author=self.user,
            category=None,
            title="Lorem ipsum dolor sit amet.",
            excerpt="Lorem ipsum dolor sit amet ipsum.",
            content="Lorem ipsum dolor sit amet.",
            is_published=True,
        )

    def login_client(self, email):
        self.client.login(email=email, password="testCASE123.")
