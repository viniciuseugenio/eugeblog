from django.views.generic import ListView, DetailView
from .models import Post


class PostsList(ListView):
    model = Post
    context_object_name = "posts"
    queryset = Post.objects.filter(is_published=True)
    template_name = "posts/index.html"
    ordering = ["-id"]


class PostDetails(DetailView):
    model = Post
    context_object_name = "post"
    template_name = "posts/details.html"
    pk_url_kwarg = "pk"
