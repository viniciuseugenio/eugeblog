from bookmarks.models import Bookmarks
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from utils import api_helpers
from utils.api_helpers import TokenRefreshMixin
from utils.make_pagination import BaseDropdownPagination, BaseListPagination

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Post.objects.filter(author=user).order_by("-id")
        return qs


class PostDetails(TokenRefreshMixin, generics.RetrieveAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostDetailsSerializer

    def get_object(self):
        post_pk = self.kwargs.get("pk")

        try:
            return Post.objects.get(pk=post_pk)
        except Post.DoesNotExist:
            raise NotFound("This post does not exist or is not published.")

    def get(self, request, *args, **kwargs):
        post = self.get_object()
        post_serialized = self.serializer_class(post)

        user = request.user
        response = Response({}, status=status.HTTP_200_OK)

        # Use function from TokenRefreshMixin to set the tokens if there are any
        if request.auth:
            self.set_tokens(response, request.auth)

        response.data["post"] = post_serialized.data

        if user.is_authenticated:
            is_bookmarked = Bookmarks.objects.filter(post=post, user=user).exists()
            has_modify_permission = api_helpers.can_edit_post(user, post)

            response.data.update(
                {
                    "is_bookmarked": is_bookmarked,
                    "has_modify_permission": has_modify_permission,
                }
            )

        return response


class PostCreation(TokenRefreshMixin, generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreationSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({})

        if request.auth:
            self.set_tokens(response, request.auth)

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
