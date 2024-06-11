"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path("", views.home, name="home")
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path("", Home.as_view(), name="home")
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path("blog/", include("blog.urls"))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.http import JsonResponse
from api.views import *
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static
from backend import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Define the schema view for Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="Test description",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r"custom-queries", CustomQueryViewSet, basename='customquery')
router.register(r"folders", FolderViewSet, basename='folders')
router.register(r'favorite-queries', FavoriteQueryViewSet, basename='favoritequery')
router.register(r'folder-and-queries', FolderAndQueriesViewSet, basename='folder-and-queries')

# TODO: if the existing views that are not part of a viewset
# (e.g., custom actions or non-RESTful views), then we can leave them as it is.
# otherwise we should change them to use the default router.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # testing data fetching
    path('api/graphData', graph_data),
    path('upload_file/', upload_file),
    path('save_graph/', save_graph),  # used for testing
    path('view_graph/<int:query_id>/', view_graph),
    path('cypher_query/', cypher_query),  # save queries
    path('run_query/', run_query),  # queries that result in a subgraph
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path('.*', lambda request: JsonResponse({'error': 'Not Found'}, status=404)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
