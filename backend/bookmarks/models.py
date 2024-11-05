from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from posts.models import Post

User = get_user_model()


# Create your models here.
class Bookmarks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_("User"))
    post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name=_("Post"))

    class Meta:
        verbose_name = _("Bookmark")
        verbose_name_plural = _("Bookmarks")

    def __str__(self):
        return f"{self.user} - Post {self.post.pk}"
