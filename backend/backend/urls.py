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

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r"custom_queries", CustomQueryViewSet)

# TODO: if the existing views that are not part of a viewset
# (e.g., custom actions or non-RESTful views), then we can leave them as it is.
# otherwise we should change them to use the default router.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # testing datafetching
    path('api/graphData', graph_data),
    path('upload_file/', upload_file),
    path('save_graph/', save_graph),  # used for testing
    path('view_graph/<int:query_id>/', view_graph),
    path('cypher_query/', cypher_query),  # save queries
    path('run_query/', run_query),  # queries that result in a subgraph
    re_path(
        '.*', lambda request: JsonResponse({'error': 'Not Found'}, status=404)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
