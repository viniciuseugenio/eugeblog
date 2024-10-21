import os
from typing import Any

from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.forms import model_to_dict
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views import generic
from dotenv import load_dotenv

import utils
from bookmarks.models import Bookmarks

from . import forms
from .models import Comment, Post

load_dotenv()

User = get_user_model()
LOGIN_URL = "account_login"
PER_PAGE = os.environ.get("PER_PAGE")


class PostReviewerCheck:
    def dispatch(self, request, *args, **kwargs):
        pk = self.kwargs.get("pk")
        is_allowed = (
            request.user.groups.filter(name="post_reviewer").exists()
            or request.user.is_superuser
        )

        if not is_allowed and pk is None:
            messages.error(request, utils.notifications.ERROR["not_post_reviewer"])
            return redirect("posts:list_view")

        if pk is not None:
            post = Post.objects.get(pk=pk)

            if post.is_published:
                messages.error(request, utils.notifications.ERROR["post_is_published"])
                return redirect("posts:details_view", pk)

            if request.user != post.author and not is_allowed:
                messages.error(
                    request, utils.notifications.ERROR["prohibited_notification"]
                )
                return redirect("posts:list_view")

        return super().dispatch(request, *args, **kwargs)


class PostsList(generic.ListView):
    model = Post
    context_object_name = "posts"
    queryset = Post.objects.filter(is_published=True)
    template_name = "posts/index.html"
    ordering = ["-id"]
    paginate_by = PER_PAGE

    def get_queryset(self):
        qs = super().get_queryset()
        search_term = self.request.GET.get("q")

        if search_term:
            search_term = search_term.strip()

            qs = qs.filter(
                Q(
                    Q(title__icontains=search_term)
                    | Q(author__first_name__icontains=search_term)
                )
            )

        return qs

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)

        page_range = context["paginator"].page_range
        current_page = context["page_obj"].number
        paginator = utils.make_pagination(page_range, current_page)
        has_search = self.request.GET.get("q", "") != ""

        # Done this way to get the URL dinamically and remove the 0 kwarg from the end
        url = reverse_lazy("posts:details_view", kwargs={"pk": 0})[0:-1]

        context.update(
            {
                "paginator": paginator,
                "has_search": has_search,
                "url": url,
            }
        )

        return context


class PostDetails(generic.DetailView):
    model = Post
    context_object_name = "post"
    template_name = "posts/details.html"
    pk_url_kwarg = "pk"

    def get(self, *args, **kwargs):
        pk = self.kwargs.get("pk")
        history = self.request.session.get("history", [])

        if not history:
            self.request.session["history"] = []

        if pk in history:
            index = history.index(pk)
            history.pop(index)

        if len(history) == 5 and pk not in history:
            history.pop()

        history.insert(0, pk)

        self.request.session["history"] = history
        return super().get(*args, **kwargs)

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        user = self.request.user

        comments = Comment.objects.filter(post=self.get_object()).order_by("-id")

        post = self.get_object()
        is_author = post.author == user

        if user.is_authenticated:
            is_bookmarked = Bookmarks.objects.filter(user=user, post=post).exists()
            context.update({"is_bookmarked": is_bookmarked})

        history = self.request.session.get("history")
        history_objs = []

        if len(history) > 0:
            history_objs = [
                Post.objects.get(id=id)
                for id in history
                if Post.objects.filter(id=id, is_published=True).exists()
            ]

        context.update(
            {
                "comments": comments,
                "qty_comments": comments.count(),
                "is_author": is_author,
                "history_objs": history_objs,
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
            messages.error(request, utils.notifications.ERROR["comment_empty"])
            return redirect("posts:details_view", post_id)

        post_obj = Post.objects.get(id=post_id)

        Comment.objects.create(
            author=self.request.user,
            post=post_obj,
            comment=content,
        )

        messages.success(request, utils.notifications.SUCCESS["comment_created"])
        return redirect("posts:details_view", post_id)


class PostCreate(LoginRequiredMixin, generic.CreateView):
    model = Post
    form_class = forms.CreatePostForm
    template_name = "posts/create.html"
    login_url = LOGIN_URL
    success_url = reverse_lazy("posts:list_view")

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, utils.notifications.SUCCESS["post_created"])
        return super().form_valid(form)


class PostEdit(LoginRequiredMixin, generic.UpdateView):
    model = Post
    form_class = forms.CreatePostForm
    template_name = "posts/edit.html"

    def get(self, request, *args, **kwargs):
        is_allowed = (
            request.user.groups.filter(name="post_reviewer").exists()
            or request.user.is_superuser
        )

        if request.user != self.get_object().author and not is_allowed:
            messages.error(request, utils.notifications.ERROR["not_post_author"])
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
            messages.success(self.request, utils.notifications.SUCCESS["post_edited"])

        return super().form_valid(form)


class PostDelete(LoginRequiredMixin, generic.DeleteView):
    model = Post
    success_url = reverse_lazy("posts:list_view")

    def post(self, request, *args, **kwargs):
        post_obj = self.get_object()

        if request.user != post_obj.author:
            messages.error(request, utils.notifications.ERROR["not_post_author"])
            return redirect("posts:details_view", self.kwargs.get("pk"))

        return super().post(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, utils.notifications.SUCCESS["post_deleted"])
        return super().form_valid(form)


class PostsReview(LoginRequiredMixin, PostReviewerCheck, generic.ListView):
    model = Post
    template_name = "posts/review_list.html"
    context_object_name = "posts"

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(is_published=False)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        url = reverse_lazy("posts:review_details", kwargs={"pk": 0})[0:-1]

        context.update(
            {
                "url": url,
            }
        )
        return context


class ReviewDetails(LoginRequiredMixin, PostReviewerCheck, generic.DetailView):
    model = Post
    template_name = "posts/review_details.html"
    context_object_name = "post"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        is_safe = False
        page = "review"

        context.update(
            {
                "is_safe": is_safe,
                "page": page,
            }
        )

        return context


def review_allow(request, pk):
    if request.method != "POST":
        return redirect("posts:review_list")

    post = Post.objects.get(pk=pk)
    post.is_published = True
    post.save()

    messages.success(request, utils.notifications.SUCCESS["post_published"])
    return redirect("posts:details_view", pk)
