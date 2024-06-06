from django.contrib import admin
from django.urls import path, re_path, include
from django.http import JsonResponse
from api.views import (
    upload_file,
    graph_data,
    ProjectViewSet
)
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static
from backend import settings

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

# TODO: if the existing views that are not part of a viewset
# (e.g., custom actions or non-RESTful views), then we can leave them as it is.
# otherwise we should change them to use the default router.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)), 
    path('api/graphData', graph_data),
    path('upload_file/', upload_file),
    re_path(
        '.*', lambda request: JsonResponse({'error': 'Not Found'}, status=404)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
