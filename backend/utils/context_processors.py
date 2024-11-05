from django.contrib.auth import get_user_model

User = get_user_model()


def is_post_reviewer(request):
    is_post_reviewer = request.user.groups.filter(name="post_reviewer").exists()
    return {"is_post_reviewer": is_post_reviewer}
