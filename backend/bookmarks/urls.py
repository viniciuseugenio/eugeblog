from django.urls import path

from . import views

app_name = "bookmarks"


site_urls = [
    path("create/<int:pk>", views.CreateBookmark.as_view(), name="create_view"),
    path("list/", views.DisplayBookmarks.as_view(), name="list_view"),
    path(
        "delete/<int:post_pk>/<str:origin>",
        views.DeleteBookmark.as_view(),
        name="delete_view",
    ),
]

api_urls = [
    path("api/create/<int:pk>", views.BookmarkPost.as_view(), name="create_api_view"),
    path(
        "api/delete/<int:pk>",
        views.RemoveBookmark.as_view(),
        name="delete_api_view",
    ),
]

urlpatterns = site_urls + api_urls
