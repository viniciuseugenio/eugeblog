from django.shortcuts import render
from django.views.generic import ListView
from .models import Post


class PostsList(ListView):
    model = Post
    context_object_name = "posts"
    queryset = Post.objects.filter(is_published=True)
    template_name = "posts/index.html"
    ordering = ["-id"]
