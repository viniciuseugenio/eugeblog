from posts.models import Post, Comment, Category
from rest_framework import serializers
from accounts.api.serializers import UserCommentDetailsSerializer


class AuthorFullnameField(serializers.Field):
    def to_representation(self, value):
        if value:
            return f"{value.first_name} {value.last_name}"

        return ""


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class PostBaseSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    author = AuthorFullnameField()
    category = CategorySerializer()

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "image",
            "category",
            "title",
            "excerpt",
            "created_at",
            "review_status",
            "content",
        ]


class PostListSerializer(PostBaseSerializer):
    pass


class PostCreationSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=True
    )

    class Meta(PostBaseSerializer.Meta):
        fields = PostBaseSerializer.Meta.fields

    def validate_content(self, value):
        if not value or len(value.strip()) < 1000:
            raise serializers.ValidationError(
                "This article is too short! It must have at least 1000 characters."
            )

        return value


class CommentDetailsSerializer(serializers.ModelSerializer):
    author = UserCommentDetailsSerializer()

    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at"]


class PostDetailsSerializer(PostBaseSerializer):
    category = CategorySerializer()

    class Meta(PostBaseSerializer.Meta):
        fields = PostBaseSerializer.Meta.fields


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "content"]
