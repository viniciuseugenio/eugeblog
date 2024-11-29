import os

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.views import generic
from dotenv import load_dotenv

import utils
from posts.models import Post

from bookmarks.models import Bookmarks

load_dotenv()

PER_PAGE = os.environ.get("PER_PAGE")
LOGIN_URL = "account_login"


# Create your views here.
class CreateBookmark(LoginRequiredMixin, generic.View):
    login_url = LOGIN_URL

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get("pk")
        post = Post.objects.get(pk=pk)
        user = self.request.user

        already_bookmarked = Bookmarks.objects.filter(user=user, post=post).exists()

        if already_bookmarked:
            messages.error(
                request, utils.notifications.ERROR["post_already_bookmarked"]
            )
            return redirect("posts:details_view", post.id, permanent=True)

        Bookmarks.objects.create(user=user, post=post)

        messages.success(request, utils.notifications.SUCCESS["post_bookmarked"])
        return redirect("posts:details_view", post.id, permanent=True)


class DisplayBookmarks(LoginRequiredMixin, generic.ListView):
    model = Bookmarks
    login_url = LOGIN_URL
    paginate_by = PER_PAGE
    template_name = "bookmarks/list.html"
    context_object_name = "bookmarks"

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(user=self.request.user)

        return qs

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(object_list=object_list, **kwargs)

        page_range = context["paginator"].page_range
        current_page = context["page_obj"].number
        paginator = utils.make_pagination(page_range, current_page)

        posts = []
        for bookmark in context.get("object_list"):
            posts.append(bookmark.post)

        context.update(
            {
                "posts": posts,
                "paginator": paginator,
            }
        )

        return context


class DeleteBookmark(LoginRequiredMixin, generic.View):
    login_url = LOGIN_URL

    def post(self, request, *args, **kwargs):
        post_pk = self.kwargs.get("post_pk")
        origin = self.kwargs.get("origin")

        post = Post.objects.get(id=post_pk)
        bookmark = Bookmarks.objects.filter(user=request.user, post=post)

        if not bookmark.exists():
            return redirect("posts:details_view", post.id, permanent=True)

        bookmark.delete()
        messages.warning(request, utils.notifications.WARNING["bookmark_removed"])
        return redirect("posts:details_view", post.id, permanent=True)
