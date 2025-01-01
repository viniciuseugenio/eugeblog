from django.contrib.auth import get_user_model
from posts.models import Post
from rest_framework import generics, status
from rest_framework.response import Response
from utils import api_helpers
from utils.make_pagination import BaseDropdownPagination

from bookmarks.models import Bookmarks

from ..serializers import BookmarksSerializer

User = get_user_model()


class BookmarksList(generics.ListAPIView):
    queryset = Bookmarks.objects.filter(post__is_published=True).order_by("-id")
    serializer_class = BookmarksSerializer
    pagination_class = BaseDropdownPagination
    permission_classes = [IsAuthenticatedUser]

    def get_queryset(self):
        user = self.request.user
        return Bookmarks.objects.filter(user=user)


class BookmarkPost(generics.CreateAPIView):
    permission_classes = [IsAuthenticatedUser]

    def post(self, request, *args, **kwargs):
        user = request.user
        post_id = kwargs.get("pk")
        post_obj = Post.objects.get(id=post_id)

        if post_obj.is_published is False:
            auth_response.data["message"] = "This post is not published."
            auth_response.status_code = 400
            return auth_response

        if Bookmarks.objects.filter(user=user, post=post_obj).exists():
            auth_response.data["message"] = "Post already bookmarked."
            auth_response.status_code = 400
            return auth_response

        Bookmarks.objects.create(user=user, post=post_obj)

        auth_response.data["message"] = "Post bookmarked successfully."
        auth_response.status_code = 201

        return auth_response


class RemoveBookmark(generics.DestroyAPIView):
    permission_classes = [IsAuthenticatedUser]

    def delete(self, request, **kwargs):
        user = request.user
        post_id = kwargs.get("pk")
        post_obj = Post.objects.get(id=post_id)

        if post_obj.is_published is False:
            auth_response.data["message"] = "This post is not published."
            auth_response.status_code = status.HTTP_400_BAD_REQUEST
            return auth_response

        if not Bookmarks.objects.filter(user=user, post=post_obj).exists():
            auth_response.data["message"] = "Post not bookmarked."
            auth_response.status_code = status.HTTP_400_BAD_REQUEST
            return auth_response

        Bookmarks.objects.filter(user=user, post=post_obj).delete()

        auth_response.data["message"] = "Post removed from bookmarks."
        auth_response.status_code = status.HTTP_200_OK

        return auth_response
