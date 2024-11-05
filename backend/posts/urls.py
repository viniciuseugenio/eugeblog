from django.urls import path
from .views import site as site_views
from .views import api as api_views

app_name = "posts"

site_urls = [
    path("", site_views.PostsList.as_view(), name="list_view"),
    path(
        "posts/details/<int:pk>", site_views.PostDetails.as_view(), name="details_view"
    ),
    path("posts/comment/", site_views.PostComment.as_view(), name="comment_view"),
    path("posts/create/", site_views.PostCreate.as_view(), name="create_view"),
    path("posts/edit/<int:pk>", site_views.PostEdit.as_view(), name="edit_view"),
    path("posts/delete/<int:pk>", site_views.PostDelete.as_view(), name="delete_view"),
    path("posts/review/list", site_views.PostsReview.as_view(), name="review_list"),
    path(
        "posts/review/details/<int:pk>",
        site_views.ReviewDetails.as_view(),
        name="review_details",
    ),
    path("posts/review/allow/<int:pk>", site_views.review_allow, name="review_allow"),
]

api_urls = [
    path("api/posts/", api_views.PostsList.as_view(), name="api_list"),
    path("api/post/<int:pk>", api_views.PostDetails.as_view(), name="api_details"),
    path(
        "api/post/<int:pk>/comments",
        api_views.PostComments.as_view(),
        name="api_comments",
    ),
]

urlpatterns = site_urls + api_urls
