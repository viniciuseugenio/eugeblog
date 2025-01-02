from django.shortcuts import get_object_or_404
from bookmarks.models import Bookmarks
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from utils import api_helpers
from utils.make_pagination import BaseDropdownPagination, BaseListPagination
from utils.permissions import IsAuthenticatedUser

from ..models import Category, Comment, Post
from ..serializers import (
    CategorySerializer,
    CommentCreateSerializer,
    CommentDetailsSerializer,
    PostCreationSerializer,
    PostDetailsSerializer,
    PostListSerializer,
)

User = get_user_model()
load_dotenv()


class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class PostsList(generics.ListAPIView):
    queryset = Post.objects.filter(is_published=True).order_by("-id")
    serializer_class = PostListSerializer
    pagination_class = BaseListPagination


class UserPostsList(generics.ListAPIView):
    serializer_class = PostListSerializer
    pagination_class = BaseDropdownPagination
    permission_classes = [IsAuthenticatedUser]

    def get_queryset(self):
        user = self.request.user
        qs = Post.objects.filter(author=user).order_by("-id")
        return qs


class PostDetails(generics.RetrieveAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostDetailsSerializer

    def get_object(self):
        post_pk = self.kwargs.get("pk")
        return get_object_or_404(Post, pk=post_pk, is_published=True)

    def check_user_authentication(self, request):
        auth_response = api_helpers.check_authentication(request, Response({}))
        user_id = auth_response.data.get("user_id")
        user = None

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            pass

        return user, auth_response

    def get(self, request, *args, **kwargs):
        post = self.get_object()
        post_serialized = self.serializer_class(post)

        user, response = self.check_user_authentication(request)
        response.data["post"] = post_serialized.data

        if user:
            is_bookmarked = Bookmarks.objects.filter(post=post, user=user).exists()
            has_modify_permission = api_helpers.can_edit_post(user, post)

            response.data.update(
                {
                    "is_bookmarked": is_bookmarked,
                    "has_modify_permission": has_modify_permission,
                }
            )

        return response


class PostCreation(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreationSerializer
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        # Use check_authentication() function to get the user_id
        response = request.auth_response
        user = request.user

        # Validate and save the new post data
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(author=user, review_status="P")
            response.data = serializer.data
            response.status_code = status.HTTP_201_CREATED
            return response

        # Handle invalid data
        response.data = {"errors": serializer.errors}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response


class PostComments(generics.ListCreateAPIView):
    serializer_class = CommentDetailsSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticatedUser()]

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
