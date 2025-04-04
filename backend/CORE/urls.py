"""
URL configuration for CORE project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from accounts.views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
)
from posts.views import CategoryList

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("posts.urls")),
    path("bookmarks/", include("bookmarks.urls")),
    path("accounts/", include("allauth.urls")),  # URLs from django-allauth
    path("accounts/", include("accounts.urls")),  # Additional URLs
    path("summernote/", include("django_summernote.urls")),
    # API endpoints
    path("api/posts/", include("posts.api.urls")),
    path("api/bookmarks/", include("bookmarks.api.urls")),
    path("api/accounts/", include("accounts.api.urls")),
    path("api/categories/", CategoryList.as_view(), name="categories_api"),
    # JWT authentication
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", CustomTokenVerifyView.as_view(), name="token_verify"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
