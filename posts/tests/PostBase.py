import os

from django.conf import settings
from django.contrib.auth import get_user_model

from posts.models import Category, Post

User = get_user_model()


class BasePostTest:
    def setUp(self):
        image_path = os.path.join(settings.BASE_DIR, "media/coffee.jpg")

        self.category = Category.objects.create(name="Test")
        self.user = self.create_user("email@email.com")

        self.form_data = {
            "title": "You may never doubt yourself.",
            "excerpt": "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "content": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ipsam incidunt praesentium accusantium veritatis ut ea esse laboriosam nulla, aliquid sapiente saepe distinctio officia eos placeat. Dicta ipsa ipsum velit.",
            "image": open(image_path, "rb"),
            "category": self.category.pk,
        }

    def login_client(self, email="email@email.com"):
        self.client.login(email=email, password="testCASE123.")

    def create_user(self, email):
        return User.objects.create_user(
            email=email,
            first_name="Test",
            last_name="Case",
            password="testCASE123.",
        )

    def create_post(self, author, title):
        return Post.objects.create(
            author=author,
            title=title,
            excerpt="Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ipsam incidunt praesentium accusantium veritatis ut ea esse laboriosam nulla, aliquid sapiente saepe distinctio officia eos placeat. Dicta ipsa ipsum velit.",
            image="coffee.jpg",
            is_published=True,
            category=self.category,
        )
