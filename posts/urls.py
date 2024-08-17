from django.urls import path
from . import views

app_name = "posts"

urlpatterns = [
    path("", views.PostsList.as_view(), name="list_view"),
]
