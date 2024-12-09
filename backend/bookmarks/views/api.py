from django.contrib.auth import get_user_model
from posts.models import Post
from rest_framework import generics, status
from rest_framework.response import Response
from utils import api_helpers
from utils.make_pagination import BaseListPagination

from bookmarks.models import Bookmarks

from ..serializers import BookmarksSerializer

User = get_user_model()


class BookmarksListPagination(BaseListPagination):
    page_size = 6


class BookmarksList(generics.ListAPIView):
    serializer_class = BookmarksSerializer
    pagination_class = BookmarksListPagination

    def get_queryset(self):
        base_response = Response({"authenticatd": False, "user_id": 0})
        auth_info = api_helpers.check_authentication(self.request, base_response)

        if not auth_info["authenticated"]:
            return Response(
                {"message": "You have to be logged in."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user_id = auth_info["user_id"]
        user_obj = User.objects.get(id=user_id)

        return Bookmarks.objects.filter(
            user=user_obj, post__is_published=True
        ).order_by("-id")


class BookmarkPost(generics.CreateAPIView):
    def post(self, request, **kwargs):
        base_response = Response({"authenticatd": False, "user_id": 0})
        auth_info = api_helpers.check_authentication(request, base_response)
        auth_response = auth_info["response"]

        if not auth_info["authenticated"]:
            auth_response.data["message"] = "You have to be logged in."
            auth_response.status_code = status.HTTP_401_UNAUTHORIZED
            return auth_response

        user = User.objects.get(id=auth_info["user_id"])
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
    def delete(self, request, **kwargs):
        base_response = Response({"authenticatd": False, "user_id": 0})
        auth_info = api_helpers.check_authentication(request, base_response)
        auth_response = auth_info["response"]

        if not auth_info["authenticated"]:
            auth_response.data["message"] = "You have to be logged in."
            auth_response.status_code = status.HTTP_401_UNAUTHORIZED
            return auth_response

        user = User.objects.get(id=auth_info["user_id"])
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
