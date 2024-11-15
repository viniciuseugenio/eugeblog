from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import (
    PostDetailsSerializer,
    PostListSerializer,
    CommentDetailsSerializer,
    CommentCreateSerializer,
)
from ..models import Post, Comment


User = get_user_model()


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