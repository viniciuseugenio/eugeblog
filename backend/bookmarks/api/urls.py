from ..views import api
from django.urls import path

urlpatterns = [
    path("", api.BookmarksListCreate.as_view(), name="list_create"),
    path(
        "<int:pk>/",
        api.RemoveBookmark.as_view(),
        name="delete_api_view",
    ),
]
