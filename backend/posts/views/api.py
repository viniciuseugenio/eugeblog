from bookmarks.models import Bookmarks
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import Http404
from dotenv import load_dotenv
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotAuthenticated, NotFound
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


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    pagination_class = BaseListPagination

    def get_serializer_class(self):
        serializers = {
            "create": PostCreationSerializer,
            "partial_update": PostCreationSerializer,
            "list": PostListSerializer,
            "user_posts": PostListSerializer,
        }

        return serializers.get(self.action, PostDetailsSerializer)

    def get_queryset(self):
        qs = super().get_queryset()

        if self.action == "create":
            return qs

        if self.action == "list":
            qs = qs.filter(is_published=True).order_by("-id")
            search = self.request.query_params.get("q")

            if search:
                qs = qs.filter(
                    Q(title__icontains=search) | Q(excerpt__icontains=search)
                )

        return qs

    def get_permissions(self):
        action_permissions = {
            "update": [IsOwnerOrPostReviewer()],
            "partial_update": [IsOwnerOrPostReviewer()],
            "destroy": [IsOwnerOrPostReviewer()],
            "review": [IsOwnerOrPostReviewer()],
            "accept_review": [IsOwnerOrPostReviewer()],
            "create": [IsAuthenticated()],
            "user_posts": [IsAuthenticated()],
            "manage_comment": [IsAuthenticated()],
        }

        return action_permissions.get(self.action, [AllowAny()])

    def get_object(self):
        try:
            if self.action in ["update", "destroy", "partial_update"]:
                parameters = {"pk": self.kwargs.get("pk")}
            elif self.action in ["review", "accept_review"]:
                parameters = {
                    "pk": self.kwargs.get("pk"),
                    "review_status": "P",
                    "is_published": False,
                }
            else:
                parameters = {"pk": self.kwargs.get("pk"), "is_published": True}

            return Post.objects.get(**parameters)
        except Post.DoesNotExist:
            raise NotFound("This post does not exist or was deleted.")

    def create(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save(author=user, review_status="P")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        post = self.get_object()
        post_serialized = self.get_serializer(post)
        context = self._get_post_context(post, request.user)

        return Response(
            {
                "post": post_serialized.data,
                **context,
            }
        )

    def partial_update(self, request, *args, **kwargs):
        if not request.data:
            return Response(
                {"detail": "No changes were made."}, status=status.HTTP_400_BAD_REQUEST
            )

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure the post is sent to review after editing
        instance.is_published = False
        instance.review_status = "P"

        serializer.save()

        return Response(
            {"detail": "This post was successfully updated!"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["GET"])
    def review(self, request, pk=None):
        post = self.get_object()

        if not post:
            raise Http404("This post does not exist or was already reviewed.")

        post_serialized = self.get_serializer(post)
        context = self._get_post_context(post, request.user)

        return Response(
            {
                "post": post_serialized.data,
                **context,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["POST"], url_path="review/accept")
    def accept_review(self, request, pk=None):
        post = Post.objects.filter(is_published=False, review_status="P", pk=pk)

        if not post.exists():
            raise Http404("This post does not exist or was already reviewed.")

        post = post.first()
        post.review_status = "A"
        post.is_published = True
        post.save()

        post_serialized = self.get_serializer(post)
        return Response(post_serialized.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"], url_path="categories")
    def get_categories(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["GET"],
        url_path="user",
        pagination_class=BaseDropdownPagination,
    )
    def user_posts(self, request):
        user = request.user
        qs = Post.objects.filter(author=user).order_by("-id")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["GET", "POST"], url_path="comments")
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            comments = Comment.objects.filter(post=post).order_by("-id")
            serializer = CommentDetailsSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "POST":
            user = request.user

            if not user.is_authenticated:
                raise NotAuthenticated("You must be logged in to comment on this post.")

            content = request.data.get("content")
            if not content:
                return Response(
                    {"detail": "Comment cannot be left empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            Comment.objects.create(post=post, author=user, content=content)
            return Response("Comment created!", status=status.HTTP_201_CREATED)

    @action(
        detail=True,
        methods=["DELETE", "PATCH"],
        url_path="comments/(?P<comment_id>[0-9]+)",
    )
    def manage_comment(self, request, pk=None, comment_id=None):
        post = self.get_object()
        user = request.user

        try:
            comment = Comment.objects.get(post=post, author=user, pk=comment_id)
        except Comment.DoesNotExist:
            return NotFound("This comment does not exist or was already removed.")

        if request.method == "DELETE":
            comment.delete()
            return Response(
                {"detail": "Comment deleted successfully!"}, status=status.HTTP_200_OK
            )

        elif request.method == "PATCH":
            serializer = CommentCreateSerializer(
                comment, data=request.data, partial=True
            )

            serializer.is_valid(raise_exception=True)

            serializer.save()
            return Response(
                {"detail": "Your comment was edited."}, status=status.HTTP_200_OK
            )

    def _get_post_context(self, post, user):
        is_bookmarked = False
        is_reviewer = False
        is_owner = False

        if user.is_authenticated:
            is_bookmarked = Bookmarks.objects.filter(post=post, user=user).exists()
            is_owner = post.author == user
            is_reviewer = user.groups.filter(name="post_reviewer").exists()

        return {
            "is_bookmarked": is_bookmarked,
            "is_reviewer": is_reviewer,
            "is_owner": is_owner,
        }
