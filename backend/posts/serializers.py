from .models import Post, Comment
from rest_framework import serializers


class PostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "title",
            "image",
            "excerpt",
        ]

    author = serializers.SerializerMethodField(method_name="get_author_full_name")

    def get_author_full_name(self, obj):
        author = obj.author
        return f"{author.first_name} {author.last_name}"


class CommentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "author", "comment", "created_at"]

    author = serializers.SerializerMethodField(method_name="get_author_full_name")

    def get_author_full_name(self, obj):
        author = obj.author
        return f"{author.first_name} {author.last_name}"


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "comment"]


class PostDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "image",
            "category",
            "title",
            "excerpt",
            "content",
            "created_at",
        ]

    category = serializers.StringRelatedField()
    author = serializers.SerializerMethodField(method_name="get_author_full_name")

    def get_author_full_name(self, obj):
        author = obj.author
        return f"{author.first_name} {author.last_name}"
