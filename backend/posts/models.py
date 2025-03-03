from django.db import models
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django_resized import ResizedImageField


User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=64, verbose_name=_("Category"))

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name


class PublishedPostManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_published=True).order_by("-id")


class ReviewPostManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(review_status="P", is_published=False)


class Post(models.Model):
    objects = models.Manager()
    published = PublishedPostManager()
    for_review = ReviewPostManager()

    author = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, verbose_name=_("Author")
    )

    image = ResizedImageField(
        size=[1366, 768],
        scale=2,
        quality=75,
        upload_to="posts_images/",
        verbose_name=_("Image"),
        help_text=_("Recommended size: 1366	× 768"),
    )
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
    review_status = models.CharField(
        max_length=1,
        choices=[
            ("P", "Pending"),
            ("A", "Approved"),
            ("R", "Rejected"),
        ],
        default="A",
    )

    class Meta:
        verbose_name = _("Post")
        verbose_name_plural = _("Posts")

    def get_absolute_url(self):
        return reverse("posts:details_view", kwargs={"pk": self.pk})

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(
        Post, related_name="comments", on_delete=models.CASCADE, verbose_name=_("Post")
    )
    author = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE, verbose_name=_("Author")
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Comment")
        verbose_name_plural = _("Comments")

    def __str__(self):
        return f"{self.author} - {self.post} ({self.post.pk})"
