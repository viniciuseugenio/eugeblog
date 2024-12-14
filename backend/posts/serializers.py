from .models import Post, Comment, Category
from rest_framework import serializers


class AuthorFullnameField(serializers.Field):
    def to_representation(self, value):
        if value:
            return f"{value.first_name} {value.last_name}"

        return ""


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class PostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "title",
            "image",
            "excerpt",
            "created_at",
            "review_status",
        ]

    author = AuthorFullnameField()


class PostCreationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=True
    )

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
            "review_status",
        ]

    def validate_content(self, value):
        if not value or len(value.strip()) < 1000:
            raise serializers.ValidationError(
                "This article is too short! It must have at least 1000 characters."
            )

        return value


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
            "review_status",
        ]

    category = serializers.StringRelatedField()
    author = AuthorFullnameField()


class CommentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "author", "comment", "created_at"]

    author = AuthorFullnameField()


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "comment"]
