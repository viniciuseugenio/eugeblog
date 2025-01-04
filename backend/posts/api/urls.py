from posts.views import api
from django.urls import path

app_name = "api"

urlpatterns = [
    path("", api.PostListCreateView.as_view(), name="list_create"),
    path("<int:pk>/", api.PostDetails.as_view(), name="api_details"),
    path("user/", api.UserPostsList.as_view(), name="api_post_list_user"),
    path(
        "<int:pk>/comments/",
        api.PostComments.as_view(),
        name="api_comments",
    ),
    path("categories/", api.CategoryList.as_view(), name="api_categories"),
]
