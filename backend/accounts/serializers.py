from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    agree = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
            "agree",
        ]
        extra_kwargs = {
            "email": {"validators": []},
            "agree": {"validators": []},
        }

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        confirm_password = attrs.get("confirm_password")
        agree = attrs.get("agree")

        errors_list = serializers.defaultdict(list)

        if agree == "off":
            errors_list["agree"].append("You must agree to the terms and conditions.")

        if User.objects.filter(email=email).exists():
            errors_list["email"].append(
                "User with this email already exists. Might be your twin!"
            )

        if password != confirm_password:
            errors_list["confirm_password"].append("Passwords do not match.")

        if errors_list:
            raise serializers.ValidationError(errors_list)

        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        validated_data.pop("agree")

        user = User.objects.create_user(**validated_data)
        return user
