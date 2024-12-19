from django.http.request import MultiPartParser
from bookmarks.models import Bookmarks
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
from rest_framework import generics, status
from rest_framework.response import Response
from utils import api_helpers
from utils.make_pagination import BaseListPagination

from ..models import Comment, Post, Category
from ..serializers import (
    CommentCreateSerializer,
    CommentDetailsSerializer,
    PostCreationSerializer,
    PostDetailsSerializer,
    PostListSerializer,
    CategorySerializer,
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


class PostDetails(generics.RetrieveAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostDetailsSerializer

    def get_object(self):
        post_pk = self.kwargs.get("pk")
        return get_object_or_404(Post, pk=post_pk, is_published=True)

    def get(self, request, *args, **kwargs):
        post = self.get_object()
        post_serialized = self.serializer_class(post)

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

        if auth_info["authenticated"] and user_id:
            user = User.objects.get(pk=user_id)
            auth_response.data["is_bookmarked"] = Bookmarks.objects.filter(
                post=post, user=user
            ).exists()

            auth_response.data["has_modify_permission"] = (
                api_helpers.check_if_is_allowed_to_edit(user_id, post.pk)
            )

        return auth_response


class PostCreation(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreationSerializer

    def post(self, request):
        print(request.data)

        # Check authentication and refresh tokens if necessary
        auth_info = api_helpers.check_authentication(
            request, Response({"authenticated": False})
        )

        # Handle unauthenticated user
        if not auth_info.get("authenticated"):
            return Response(
                {"error": "You must be logged in to create a post."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Try to fetch user, in case of failure return 404 error
        user_id = auth_info.get("user_id")
        try:
            user_obj = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "The user was not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        auth_response = auth_info.get("response")  # Response with fresh JWT tokens

        # Validate and save the new post data
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(author=user_obj)
            auth_response.data = serializer.data
            auth_response.status_code = status.HTTP_201_CREATED
            return auth_response

        # Handle invalid data
        auth_response.data = {"errors": serializer.errors}
        auth_response.status_code = status.HTTP_400_BAD_REQUEST
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
