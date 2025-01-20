import time

from bookmarks.models import Bookmarks
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import Http404
from dotenv import load_dotenv
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from utils.make_pagination import BaseDropdownPagination, BaseListPagination
from utils.permissions import IsOwnerOrPostReviewer

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

        qs = Post.objects.filter(is_published=True).order_by("-id")
        search = self.request.query_params.get("q")

        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(excerpt__icontains=search))

        return qs

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

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return PostCreationSerializer

        return PostDetailsSerializer

    def get_permissions(self):
        method_permissions = {
            "DELETE": [IsOwnerOrPostReviewer()],
            "PATCH": [IsOwnerOrPostReviewer()],
        }

        return method_permissions.get(self.request.method, [AllowAny()])

    def get_object(self):
        post_pk = self.kwargs.get("pk")

        try:
            return Post.objects.get(pk=post_pk)
        except Post.DoesNotExist:
            raise NotFound("This post does not exist or is not published.")

    def retrieve(self, request, *args, **kwargs):
        post = self.get_object()
        post_serialized = self.get_serializer(post)

        user = request.user
        is_bookmarked = False
        is_owner = False
        is_reviewer = False

        if user.is_authenticated:
            is_bookmarked = Bookmarks.objects.filter(post=post, user=user).exists()
            is_owner = post.author == user
            is_reviewer = user.groups.filter(name="post_reviewer").exists()

        return Response(
            {
                "post": post_serialized.data,
                "is_bookmarked": is_bookmarked,
                "is_owner": is_owner,
                "is_reviewer": is_reviewer,
            }
        )

    def partial_update(self, request, *args, **kwargs):
        if not request.data:
            return Response({"detail": "No changes were made."})

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "This post was successfully updated!"},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


class PostReviewDetails(generics.RetrieveUpdateAPIView):
    queryset = Post.objects.filter(is_published=False, review_status="P")
    serializer_class = PostDetailsSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrPostReviewer]

    def get_object(self):
        post_pk = self.kwargs.get("pk")
        try:
            return self.queryset.get(pk=post_pk)
        except Post.DoesNotExist:
            raise Http404("This post does not exist or was already reviewed.")

    def perform_update(self, instance):
        instance.review_status = "A"
        instance.is_published = True
        instance.save()

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_update(instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        post = self.get_object()
        post_serialized = self.get_serializer(post)

        user = request.user
        is_owner = False
        is_reviewer = False

        if user.is_authenticated:
            is_owner = post.author.id == user.id
            is_reviewer = user.groups.filter(name="post_reviewer").exists()

        return Response(
            {
                "post": post_serialized.data,
                "is_owner": is_owner,
                "is_reviewer": is_reviewer,
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
