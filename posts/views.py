from typing import Any
from django.db.models import Count
from django.shortcuts import redirect
from django.views.generic import ListView, DetailView, View
from .models import Post, Comment
from django.contrib.auth import get_user_model

User = get_user_model()


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

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        comments = Comment.objects.filter(post=self.get_object()).order_by("-id")

        context.update(
            {
                "comments": comments,
                "qty_comments": comments.count(),
            }
        )

        return context


class PostComment(View):
    def get(self, request, *args, **kwargs):
        return redirect("posts:list_view")

    def post(self, request, *args, **kwargs):
        post_id = request.POST.get("post")
        content = request.POST.get("comment").strip()

        if content.isspace() or not content:
            # TODO: Add error message
            return redirect("posts:details_view", post_id)

        post_obj = Post.objects.get(id=post_id)

        Comment.objects.create(
            author=self.request.user,
            post=post_obj,
            comment=content,
        )

        # TODO: Add created message
        return redirect("posts:details_view", post_id)
