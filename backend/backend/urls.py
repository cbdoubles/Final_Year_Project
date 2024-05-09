"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, re_path
from api.views import download_file, save_graph, view_graph, graph_data
from django.http import JsonResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/graphData/', graph_data, name='graph_data'),
    path('download_file/', download_file, name='download_file'),
    path('save_graph/', save_graph, name='save_graph'),
    path('view_graph/<int:query_id>/', view_graph, name='view_graph'),
    re_path('.*', lambda request: JsonResponse({'error': 'Not Found'}, status=404)),
]