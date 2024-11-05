from django.contrib import admin
from .models import Category, Post, Comment
from django_summernote.admin import SummernoteModelAdmin


@admin.register(Post)
class PostAdmin(SummernoteModelAdmin):
    list_display = ["id", "author", "title", "category", "created_at", "is_published"]
    list_display_links = ["id", "author"]
    list_editable = [
        "is_published",
    ]
    summernote_fields = [
        "content",
    ]
    empty_value_display = "None"
    ordering = ["-id"]


admin.site.register(Category)
admin.site.register(Comment)
