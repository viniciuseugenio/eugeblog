from typing import Any
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views import generic
from django.forms import model_to_dict
from .models import Post, Comment
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin

from templates.static import notifications
from . import forms

User = get_user_model()
LOGIN_URL = "account_login"


class PostsList(generic.ListView):
    model = Post
    context_object_name = "posts"
    queryset = Post.objects.filter(is_published=True)
    template_name = "posts/index.html"
    ordering = ["-id"]


class PostDetails(generic.DetailView):
    model = Post
    context_object_name = "post"
    template_name = "posts/details.html"
    pk_url_kwarg = "pk"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        comments = Comment.objects.filter(post=self.get_object()).order_by("-id")
        post = self.get_object()
        is_author = post.author == self.request.user

        context.update(
            {
                "comments": comments,
                "qty_comments": comments.count(),
                "is_author": is_author,
            }
        )

        return context


class PostComment(LoginRequiredMixin, generic.View):
    login_url = LOGIN_URL

    def get(self, request, *args, **kwargs):
        return redirect("posts:list_view")

    def post(self, request, *args, **kwargs):
        post_id = request.POST.get("post")
        content = request.POST.get("comment").strip()

        if content.isspace() or not content:
            messages.error(request, notifications.ERROR["comment_empty"])
            return redirect("posts:details_view", post_id)

        post_obj = Post.objects.get(id=post_id)

        Comment.objects.create(
            author=self.request.user,
            post=post_obj,
            comment=content,
        )

        messages.success(request, notifications.SUCCESS["comment_created"])
        return redirect("posts:details_view", post_id)


class PostCreate(LoginRequiredMixin, generic.CreateView):
    model = Post
    form_class = forms.CreatePostForm
    template_name = "posts/create.html"
    login_url = LOGIN_URL
    success_url = reverse_lazy("posts:list_view")

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, notifications.SUCCESS["post_created"])
        return super().form_valid(form)


class PostEdit(LoginRequiredMixin, generic.UpdateView):
    model = Post
    form_class = forms.CreatePostForm
    template_name = "posts/edit.html"

    def get(self, request, *args, **kwargs):
        if request.user != self.get_object().author:
            messages.error(request, notifications.ERROR["not_post_author"])
            return redirect("posts:list_view")

        return super().get(request, *args, **kwargs)

    def form_valid(self, form):
        # Verify if the post was changed
        original_instance = model_to_dict(self.get_object())
        edited_instance = form.cleaned_data

        # Change edited_instance to display pk of category instead of model
        edited_instance["category"] = edited_instance["category"].pk

        fields = ["title", "excerpt", "content", "image", "category"]
        edited = False

        for field in fields:
            if original_instance[field] != edited_instance[field]:
                edited = True

        if edited:
            # Send to verification again if it was edited
            form.instance.is_published = False
            form.instance.save()
            messages.success(self.request, notifications.SUCCESS["post_edited"])

        return super().form_valid(form)


class PostDelete(LoginRequiredMixin, generic.DeleteView):
    model = Post
    success_url = reverse_lazy("posts:list_view")

    def post(self, request, *args, **kwargs):
        post_obj = self.get_object()

        if request.user != post_obj.author:
            messages.error(request, notifications.ERROR["not_post_author"])
            return redirect("posts:details_view", self.kwargs.get("pk"))

        return super().post(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, notifications.SUCCESS["post_deleted"])
        return super().form_valid(form)
