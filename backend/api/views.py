from .serializers import ProjectSerializer, GraphFileSerializer
from .models import Project, GraphFile
from django.http import FileResponse, JsonResponse, HttpResponse, Http404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from py2neo import DatabaseError
from .neo4j_services import Neo4jService
from django.conf import settings
from .models import Folder, Query
import networkx as nx
from networkx.readwrite import json_graph
import os
import json
import requests
import errno
from .upload_file import process_file
# used to write views for the models
from rest_framework import viewsets, status
from .models import Project
from .serializers import FolderSerializer, GraphFileSerializer, ProjectSerializer
from .services import ProjectService, FileService
import logging


# Initialize Neo4j connection
neo4j_service = Neo4jService(
    'neo4j://localhost:7687', 'neo4j', 'cobra-paprika-nylon-conan-tobacco-2599')

# replace the password inside the upload_file


@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and equest.FILES.get('rjson_file'):
        uploaded_file = request.FILES['json_file']
        file_name = uploaded_file.name
        current_dir = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(
            current_dir, '..', 'api', 'downloads', file_name)
        # Normalize the path, resolve any '..'
        file_path = os.path.normpath(file_path)
        if not os.path.exists(os.path.dirname(file_path)):
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # writes the data into api/graphData
        process_file(file_name)

        return FileResponse(open(file_path, 'rb'))
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request'}, status=400)

# used for testing


def save_graph(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    G = nx.Graph()
    G.add_edge('A', 'B')
    data = json_graph.node_link_data(G)
    graph_json = json.dumps(data)

    query = Query(cypher_query='MATCH (n) RETURN n',
                  natural_query='Return all nodes', graph=graph_json)
    query.save()

    return JsonResponse({'message': 'Graph saved successfully'}, status=201)


def view_graph(request, query_id):
    try:
        query = Query.objects.get(id=query_id)
    except Query.DoesNotExist:
        raise Http404("Graph not found")

    graph_json = query.graph

    data = json.loads(graph_json)
    G = json_graph.node_link_graph(data)

    return JsonResponse({
        'message': 'Graph retrieved successfully',
        'cypher_query': query.cypher_query,
        'natural_query': query.natural_query,
        'graph': graph_json
    })


@csrf_exempt
def graph_data(request):
    try:
        # Define the Cypher queries
        query_nodes = "MATCH (n) RETURN id(n) AS id, elementId(n) AS elementId, properties(n) AS properties"
        query_edges = "MATCH (n)-[r]->(m) RETURN id(r) AS id, type(r) AS type, elementId(n) AS startId, elementId(m) AS endId, properties(r) AS properties"

        # Run the Cypher queries using the run_query method
        result_nodes = neo4j_service.run_query(query_nodes)
        result_edges = neo4j_service.run_query(query_edges)

        # Process the results
        nodes = [{"id": record["id"], "elementId": record["elementId"],
                  **record["properties"]} for record in result_nodes]
        edges = [{"id": record["id"], "source": record["startId"], "target": record["endId"],
                  "type": record["type"], **record["properties"]} for record in result_edges]

        # Return the data as JSON
        return JsonResponse({"nodes": nodes, "edges": edges})
    except Exception as e:
        return JsonResponse({'error': 'Neo4j query error', 'message': str(e)}, status=500)


@csrf_exempt
def cypher_query(request):
    try:
        # Get the Cypher query and save parameter from the request
        data = json.loads(request.body)
        cypher_query = data.get('cypher_query')
        natural_query = data.get('natural_query')
        if not natural_query:
            # empty -> mpty -> mty -> mt
            natural_query = "mt"
        save = data.get('save')

        # Run the Cypher query
        results = neo4j_service.run_query(cypher_query)

        # If save is True, save the query to the database
        if save:
            for record in results:
                # Convert the record to a string and save it to the database
                # convert the first field of the record to a string
                graph = str(record[0])
                query = Query(cypher_query=cypher_query,
                              natural_query=natural_query, graph=graph)
                query.save()

        # Return the results as JSON
        return JsonResponse([str(record[0]) for record in results], safe=False)
    except DatabaseError as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def run_query(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        query = data.get('query')

        # Send a POST request to the graph_data URL
        response = requests.post('http://127.0.0.1:8000/api/graphData')
        original_graph_data = response.json()
        nodes = original_graph_data['nodes']
        edges = original_graph_data['edges']

        # Run the Cypher query on the graph data
        # This is a placeholder, replace with your actual logic
        new_graph_data = neo4j_service.query_graph(query)

        # Process the results
        nodes = new_graph_data[0]
        edges = new_graph_data[1]
        # Return the new graph data
        return JsonResponse({"nodes": nodes, "edges": edges}, safe=False)
    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=500)

# class ProjectViewSet(viewsets.ModelViewSet):
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer
#     parser_classes = (MultiPartParser, FormParser)

#     def create(self, request, *args, **kwargs):
#         project_serializer = ProjectSerializer(data=request.data)
#         if project_serializer.is_valid():
#             project = project_serializer.save()

#             # Handling file upload
#             if 'file_path' in request.FILES:
#                 file_data = {
#                     'project': project.id,
#                     'file_type': request.data.get('file_type'),
#                     'file_path': request.FILES['file_path'],
#                 }
#                 file_serializer = GraphFileSerializer(
#                     data=file_data, context={'request': request})
#                 if file_serializer.is_valid():
#                     file_serializer.save()
#                     return Response(project_serializer.data, status=status.HTTP_201_CREATED)
#                 else:
#                     project.delete()  # Rollback project creation if file creation fails
#                     return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#             else:
#                 project.delete()  # Rollback project creation if file is not provided
#                 return Response({'error': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)

#         return Response(project_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --------------------------------------------------------------------------------------------------------


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        project, errors = ProjectService.create_project(request.data, request)
        if project:
            if 'file_path' in request.FILES:
                file, file_errors = FileService.upload_file(project, request)
                if file:
                    return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
                ProjectService.delete_project(project)
                return Response(file_errors, status=status.HTTP_400_BAD_REQUEST)
            ProjectService.delete_project(project)
            return Response({'error': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        project, errors = ProjectService.update_project(
            instance, request.data, partial)
        if project:
            if 'file_path' in request.FILES:
                logging.warning('We have a file here')
                file, file_errors = FileService.reupload_file(project, request)
                if file:
                    return Response(ProjectSerializer(project).data)
                return Response(file_errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(ProjectSerializer(project).data)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        FileService.delete_file(instance)
        ProjectService.delete_project(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class GraphFileViewSet(viewsets.ModelViewSet):
    queryset = GraphFile.objects.all()
    serializer_class = GraphFileSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# --------------------------------------------------------------------------------------------------------

class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # data[Project] = Project.objects.get(id=data[Project])
