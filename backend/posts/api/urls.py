from posts.views import api
from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = "api"

router = DefaultRouter(trailing_slash=True)
router.register("", api.PostViewSet, basename="post")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "<int:post_id>/comments/",
        api.PostCommentViewSet.as_view({"get": "list", "post": "create"}),
    ),
    path(
        "comments/<int:comment_id>/",
        api.PostCommentViewSet.as_view(
            {"delete": "destroy", "patch": "partial_update"}
        ),
    ),
]
