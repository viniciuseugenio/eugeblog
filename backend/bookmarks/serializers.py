from rest_framework import serializers
from .models import Bookmarks
from posts.serializers import PostListSerializer


class BookmarksSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(source="user.id", read_only=True)
    post = PostListSerializer(read_only=True)

    class Meta:
        model = Bookmarks
        fields = ["id", "user", "post"]
