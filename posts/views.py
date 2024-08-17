from django.shortcuts import render
from django.views.generic import View


class PostsList(View):
    def get(self, request, *args, **kwargs):
        return render(request, "posts/index.html")
