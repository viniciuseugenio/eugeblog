from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _


User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=64, verbose_name=_("Category"))

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name


class Post(models.Model):
    author = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, verbose_name=_("Author")
    )
    image = models.ImageField(upload_to="posts_images/", verbose_name=_("Image"))
    category = models.ForeignKey(
        Category,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        verbose_name=_("Category"),
    )
    title = models.CharField(max_length=264, verbose_name=_("Title"))
    excerpt = models.CharField(max_length=264, verbose_name=_("Excerpt"))
    content = models.TextField(verbose_name=_("Content"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated at"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created at"))
    is_published = models.BooleanField(default=False, verbose_name=_("Is published"))

    class Meta:
        verbose_name = _("Post")
        verbose_name_plural = _("Posts")

    def __str__(self):
        return self.title
