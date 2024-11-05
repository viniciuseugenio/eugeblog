from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
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


class PostDetails(APIView):
    def get(self, request, pk):
        post = Post.objects.filter(is_published=True).get(pk=pk)
        serializer = PostDetailsSerializer(post, context={"request": request})
        return Response(serializer.data)


class PostComments(APIView):
    def get(self, request, pk):
        comments = Comment.objects.filter(post=pk).order_by("-id")
        serializer = CommentDetailsSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        author = User.objects.get(pk=1)
        serializer = CommentCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(author=author, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
