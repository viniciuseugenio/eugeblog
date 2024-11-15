from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from dotenv import load_dotenv
from ..serializers import (
    PostDetailsSerializer,
    PostListSerializer,
    CommentDetailsSerializer,
    CommentCreateSerializer,
)
from ..models import Post, Comment
from utils import api_helpers


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
        postObj = Post.objects.get(pk=post_pk)
        postSerialized = PostDetailsSerializer(postObj)

        base_response = Response(
            {
                "post": postSerialized.data,
                "authenticated": False,
                "has_modify_permission": False,
            }
        )

        auth_info = api_helpers.check_authentication(request, base_response)
        auth_response = auth_info.get("response")

        if auth_info["authenticated"]:
            auth_response.data["has_modify_permission"] = (
                api_helpers.check_if_is_allowed_to_edit(
                    auth_info.get("access_token"), post_pk
                )
            )

        return auth_response


class PostComments(generics.ListCreateAPIView):
    serializer_class = CommentDetailsSerializer

    def get_queryset(self):
        post_id = self.kwargs.get("pk")
        return Comment.objects.filter(post=post_id).order_by("-id")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CommentCreateSerializer

        return CommentDetailsSerializer

    def perform_create(self, serializer):
        post = generics.get_object_or_404(Post, pk=self.kwargs.get("pk"))
        author = User.objects.get(pk=1)
        serializer.save(author=author, post=post)
