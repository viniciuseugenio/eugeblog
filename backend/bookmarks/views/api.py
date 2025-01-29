from django.contrib.auth import get_user_model
from posts.models import Post
from rest_framework import generics, status
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils.make_pagination import BaseDropdownPagination

from bookmarks.models import Bookmarks

from ..api.serializers import BookmarksSerializer

User = get_user_model()


class BookmarksListCreate(generics.ListCreateAPIView):
    queryset = Bookmarks.objects.filter(post__is_published=True).order_by("-id")
    serializer_class = BookmarksSerializer
    pagination_class = BaseDropdownPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        qs = super().get_queryset()
        qs = qs.filter(user=user)

        return qs

    def create(self, request, *args, **kwargs):
        user = request.user
        post_id = request.data.get("postId")
        post_obj = Post.objects.get(id=post_id)

        if post_obj.is_published is False:
            raise APIException(
                "This post does not exist or is not published.", code=404
            )

        if Bookmarks.objects.filter(user=user, post=post_obj).exists():
            raise APIException("This post is already bookmarked.", code=400)

        Bookmarks.objects.create(user=user, post=post_obj)

        return Response(
            {"detail": "Post bookmarked successfully!"}, status=status.HTTP_201_CREATED
        )


class RemoveBookmark(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, **kwargs):
        user = request.user
        post_id = kwargs.get("pk")
        post_obj = Post.objects.get(id=post_id)

        if post_obj.is_published is False:
            raise APIException(
                "This post does not exist or is not published.", code=404
            )

        if not Bookmarks.objects.filter(user=user, post=post_obj).exists():
            raise APIException("This post is not bookmarked.", code=400)

        Bookmarks.objects.get(user=user, post=post_obj).delete()

        return Response(
            {"detail": "Post removed from bookmarks."}, status=status.HTTP_200_OK
        )
