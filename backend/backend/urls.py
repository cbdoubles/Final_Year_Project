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
from django.urls import path
from django.http import JsonResponse
from .models import Person #change this to whatever
from api.views import upload_file, download_file#save_file #create_person, get_person, save_file
from neo4j import GraphDatabase

def graph_data(request):
    # Create a driver for your Neo4j database
    driver = GraphDatabase.driver("neo4j://localhost:7687", auth=("neo4j", "cobra-paprika-nylon-conan-tobacco-2599"))

    # Start a new session
    with driver.session() as session:
        # Run a Cypher query to fetch all nodes with auto-generated ID and properties
        result = session.run("MATCH (n) RETURN id(n) AS id, elementId(n) AS elementId, properties(n) AS properties")
        nodes = [{"id": record["id"], "elementId": record["elementId"], **record["properties"]} for record in result]

        # Run a Cypher query to fetch all edges
        result = session.run("MATCH (n)-[r]->(m) RETURN id(r) AS id, type(r) AS type, elementId(n) AS startId, elementId(m) AS endId, properties(r) AS properties")
        edges = [{"id": record["id"], "source": record["startId"], "target": record["endId"], "type": record["type"], **record["properties"]} for record in result]

    # Return the data as JSON
    return JsonResponse({"nodes": nodes, "edges": edges})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/graphData', graph_data),
    path('download_file/', download_file),
]
