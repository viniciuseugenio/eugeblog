from bookmarks.models import Bookmarks
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from utils import api_helpers

from ..models import Comment, Post
from ..serializers import (
    CommentCreateSerializer,
    CommentDetailsSerializer,
    PostDetailsSerializer,
    PostListSerializer,
)

User = get_user_model()
load_dotenv()


class PostsListPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(
            {
                "pagination": {
                    "previous": self.get_previous_link(),
                    "has_next": self.page.has_next(),
                    "has_previous": self.page.has_previous(),
                    "next_page": (
                        self.page.next_page_number() if self.page.has_next() else None
                    ),
                    "previous_page": (
                        self.page.previous_page_number()
                        if self.page.has_previous()
                        else None
                    ),
                    "qty_pages": self.page.paginator.num_pages,
                    "current_page": self.page.number,
                },
                "count": self.page.paginator.count,
                "results": data,
            }
        )


class PostsList(generics.ListAPIView):
    queryset = Post.objects.filter(is_published=True).order_by("-id")
    serializer_class = PostListSerializer
    pagination_class = PostsListPagination


class PostDetails(generics.RetrieveAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostDetailsSerializer

    def get(self, request, *args, **kwargs):
        post_pk = kwargs.get("pk")
        post_obj = Post.objects.filter(pk=post_pk, is_published=True).first()
        post_serialized = PostDetailsSerializer(post_obj)

        if not post_obj:
            return Response(
                {"error": "This post was not found or is not published."},
                status=status.HTTP_404_NOT_FOUND,
            )

        base_response = Response(
            {
                "post": post_serialized.data,
                "authenticated": False,
                "has_modify_permission": False,
                "is_bookmarked": False,
            }
        )

        auth_info = api_helpers.check_authentication(request, base_response)
        auth_response = auth_info.get("response")
        user_id = auth_info.get("user_id")

        if user_id:
            user_obj = User.objects.get(pk=user_id)
            post_bookmarked = Bookmarks.objects.filter(
                post=post_obj, user=user_obj
            ).exists()

            if post_bookmarked:
                auth_response.data["is_bookmarked"] = True

        if auth_info["authenticated"]:
            auth_response.data["has_modify_permission"] = (
                api_helpers.check_if_is_allowed_to_edit(
                    auth_info.get("access_token"), post_pk
                )
            )

        return auth_response


class PostComments(generics.ListCreateAPIView):
    serializer_class = CommentDetailsSerializer

    def post(self, request, *args, **kwargs):
        auth_info = api_helpers.check_authentication(request, Response({}))
        user_id = auth_info.get("user_id")

        if user_id == 0:
            return Response(
                {"error": "You must be logged in to post a comment."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        post_id = self.kwargs.get("pk")
        return Comment.objects.filter(post=post_id).order_by("-id")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CommentCreateSerializer

        return CommentDetailsSerializer

    def perform_create(self, serializer):
        auth_info = api_helpers.check_authentication(self.request, Response({}))
        user_id = auth_info.get("user_id")
        author = User.objects.get(pk=user_id)
        post = generics.get_object_or_404(Post, pk=self.kwargs.get("pk"))
        serializer.save(author=author, post=post)
