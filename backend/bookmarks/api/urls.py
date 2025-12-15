from django.urls import path

from ..views import api

urlpatterns = [
    path("", api.BookmarksListCreate.as_view(), name="list_create"),
    path(
        "<int:pk>/",
        api.RemoveBookmark.as_view(),
        name="delete_api_view",
    ),
]
