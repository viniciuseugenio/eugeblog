from django.contrib.auth import get_user_model
from posts.models import Post
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils.api_helpers import TokenRefreshMixin
from utils.make_pagination import BaseDropdownPagination

from bookmarks.models import Bookmarks

from ..serializers import BookmarksSerializer

User = get_user_model()


class BookmarksList(generics.ListAPIView):
    queryset = Bookmarks.objects.filter(post__is_published=True).order_by("-id")
    serializer_class = BookmarksSerializer
    pagination_class = BaseDropdownPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Bookmarks.objects.filter(user=user)


class BookmarkPost(TokenRefreshMixin, generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        post_id = kwargs.get("pk")
        post_obj = Post.objects.get(id=post_id)

        if post_obj.is_published is False:
            raise ValidationError("This post does not exist or is not published.")

        if Bookmarks.objects.filter(user=user, post=post_obj).exists():
            raise ValidationError("This post is already bookmarked.")

        Bookmarks.objects.create(user=user, post=post_obj)

        response = Response({})

        if request.auth:
            self.set_tokens(response, request.auth)

        response.data["detail"] = "Post bookmarked successfully!"
        response.status_code = status.HTTP_201_CREATED

        return response


class RemoveBookmark(TokenRefreshMixin, generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, **kwargs):
        user = request.user
        post_id = kwargs.get("pk")
        post_obj = Post.objects.get(id=post_id)

        if post_obj.is_published is False:
            raise ValidationError("This post does not exist or is not published.")

        if not Bookmarks.objects.filter(user=user, post=post_obj).exists():
            raise ValidationError("This post is not bookmarked.")

        Bookmarks.objects.filter(user=user, post=post_obj).delete()

        response = Response({})

        if request.auth:
            self.set_tokens(response, request.auth)

        response.data["detail"] = "Post removed from bookmarks."
        response.status_code = status.HTTP_200_OK

        return response
