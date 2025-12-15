from django.urls import path

from . import views

app_name = "bookmarks"


urlpatterns = [
    path("/", views.BookmarksListCreate.as_view(), name="list_create"),
    path(
        "delete/<int:post_pk>/<str:origin>",
        views.DeleteBookmark.as_view(),
        name="delete_view",
    ),
]
