import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission

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

    def create_user(self, email, is_post_reviewer=True):
        post_reviewer, created = Group.objects.get_or_create(name="post_reviewer")
        permission = Permission.objects.get(name="Can change post")

        post_reviewer.permissions.add(permission)

        user = User.objects.create_user(
            email=email,
            first_name="Test",
            last_name="Case",
            password="testCASE123.",
        )

        if is_post_reviewer:
            user.groups.add(post_reviewer)

        return user

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
