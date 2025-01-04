from django.urls import path

from . import views

app_name = "bookmarks"


urlpatterns = [
    path("create/<int:pk>", views.CreateBookmark.as_view(), name="create_view"),
    path("list/", views.DisplayBookmarks.as_view(), name="list_view"),
    path(
        "delete/<int:post_pk>/<str:origin>",
        views.DeleteBookmark.as_view(),
        name="delete_view",
    ),
]
