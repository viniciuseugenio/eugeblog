from bookmarks.models import Bookmarks
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from utils import api_helpers
from utils.make_pagination import BaseDropdownPagination, BaseListPagination

from ..api.serializers import (
    CategorySerializer,
    CommentCreateSerializer,
    CommentDetailsSerializer,
    PostCreationSerializer,
    PostDetailsSerializer,
    PostListSerializer,
)
from ..models import Category, Comment, Post

User = get_user_model()
load_dotenv()


class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    pagination_class = BaseListPagination

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PostCreationSerializer

        return PostListSerializer

    def get_queryset(self):
        if self.request.method == "POST":
            return super().get_queryset()

        return Post.objects.filter(is_published=True).order_by("-id")

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    def post(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(author=user, review_status="P")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Handle invalid data
        return Response(
            {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


class UserPostsList(generics.ListAPIView):
    serializer_class = PostListSerializer
    pagination_class = BaseDropdownPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Post.objects.filter(author=user).order_by("-id")
        return qs


class PostDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostDetailsSerializer

    def get_object(self):
        post_pk = self.kwargs.get("pk")

        try:
            return Post.objects.get(pk=post_pk)
        except Post.DoesNotExist:
            raise NotFound("This post does not exist or is not published.")

    def retrieve(self, request, *args, **kwargs):
        post = self.get_object()
        post_serialized = self.serializer_class(post)

        user = request.user
        is_bookmarked = False
        has_modify_permission = False

        if user.is_authenticated:
            is_bookmarked = Bookmarks.objects.filter(post=post, user=user).exists()
            has_modify_permission = api_helpers.can_edit_post(user, post)

        return Response(
            {
                "post": post_serialized.data,
                "is_bookmarked": is_bookmarked,
                "has_modify_permission": has_modify_permission,
            },
            status=status.HTTP_200_OK,
        )


class PostComments(generics.ListCreateAPIView):
    serializer_class = CommentDetailsSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    def get_queryset(self):
        post_id = self.kwargs.get("pk")
        return Comment.objects.filter(post=post_id).order_by("-id")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CommentCreateSerializer

        return CommentDetailsSerializer

    def perform_create(self, serializer):
        author = self.request.user
        post = generics.get_object_or_404(Post, pk=self.kwargs.get("pk"))
        serializer.save(author=author, post=post)
