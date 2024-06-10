"""
This module contains the views for the application.

It includes views for handling file uploads, saving and retrieving graphs from the database,
retrieving graph data from a Neo4j database, running Cypher queries,
and running queries on graph data.

Each view function accepts a Django HttpRequest object
and returns a Django HttpResponse object.

Functions:
* upload_file: Handles file upload requests.
* save_graph: Saves a graph to the database.
* view_graph: Retrieves a graph from the database.
* graph_data: Retrieves graph data from a Neo4j database.
* cypher_query: Runs a Cypher query and optionally saves it to the database.
* run_query: Runs a Cypher query on graph data and returns the results.

This module also initializes a connection to the Neo4j database at the start.
"""
from .services import CustomQueryService
from .serializers import CustomQuerySerializer
from .models import CustomQuery
import os
import json
import requests
import errno
import networkx as nx
from networkx.readwrite import json_graph
from django.http import FileResponse, JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import viewsets, status
from py2neo import DatabaseError
from django.conf import settings
from .serializers import *
from .models import CustomQuery, Project, GraphFile, Folder, Query
from .neo4j_services import Neo4jService
from django.db import IntegrityError
from .upload_file import process_file
from .services import *
import logging

# Initialize Neo4j connection
neo4j_service = Neo4jService(
    "neo4j://localhost:7687", "neo4j", "cobra-paprika-nylon-conan-tobacco-2599")

# replace the password inside the upload_file


@csrf_exempt
def upload_file(request):
    """
    Handle file upload requests.

    This function accepts POST requests with a file attached.
    It saves the uploaded file to the 'downloads' directory,
    processes the file to import its data into a Neo4j database,
    and then returns the file as a response.

    If the request is not a POST request or does not have a file attached,
    it returns a JSON response with an error message.

    Parameters:
    request (django.http.HttpRequest): The request object.

    Returns:
    django.http.FileResponse: The uploaded file.
    or
    django.http.JsonResponse: A JSON response with an error message.
    """
    if request.method == "POST" and request.FILES.get("json_file"):
        uploaded_file = request.FILES["json_file"]
        file_name = uploaded_file.name
        current_dir = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(
            current_dir, "..", "api", "downloads", file_name)
        # Normalize the path, resolve any ".."
        file_path = os.path.normpath(file_path)
        if not os.path.exists(os.path.dirname(file_path)):
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # writes the data into api/graphData
        process_file(file_name)

        return FileResponse(open(file_path, "rb"))
    return JsonResponse({"status": "error", "error": "Invalid request"}, status=400)

# used for testing


def save_graph(request):
    """
    Save a graph to the database.

    This function creates a simple graph with nodes 'A' and 'B' connected by an edge,
    converts the graph to JSON format, and saves it to the database with a Cypher query
    and a natural language query.

    It only accepts POST requests. If the request method is not POST, it returns a JSON response
    with an error message.

    Parameters:
    request (django.http.HttpRequest): The request object.

    Returns:
    django.http.JsonResponse: A JSON response with a success message
    if the graph is saved successfully,
    or an error message if the request method is not POST.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    g = nx.Graph()
    g.add_edge("A", "B")
    data = json_graph.node_link_data(g)
    graph_json = json.dumps(data)

    query = Query(cypher_query="MATCH (n) RETURN n",
                  natural_query="Return all nodes", graph=graph_json)
    query.save()

    return JsonResponse({"message": "Graph saved successfully"}, status=201)


def view_graph(request, query_id):
    """
    Retrieve a graph from the database.

    This function retrieves a graph from the database using the provided query ID.
    It returns a JSON response with the graph data and the associated
    Cypher and natural language queries.

    If the graph does not exist, it raises a 404 error.

    Parameters:
    request (django.http.HttpRequest): The request object.
    query_id (int): The ID of the query associated with the graph.

    Returns:
    django.http.JsonResponse: A JSON response with the graph data and the associated queries.
    """
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        query = Query.objects.get(id=query_id)
    except Query.DoesNotExist as exc:
        raise Http404("Graph not found") from exc

    graph_json = query.graph

    return JsonResponse({
        "message": "Graph retrieved successfully",
        "cypher_query": query.cypher_query,
        "natural_query": query.natural_query,
        "graph": graph_json
    })


@csrf_exempt
def graph_data(request):
    """
    Retrieve graph data from a Neo4j database.

    This function runs two Cypher queries to retrieve nodes and edges from the database,
    processes the results, and returns them as JSON.

    If an error occurs during the execution of the queries,
    it returns a JSON response with an error message.

    Parameters:
    request (django.http.HttpRequest): The request object.

    Returns:
    django.http.JsonResponse: A JSON response with the graph data or an error message.
    """
    if request.method != "GET":  # or POST
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        # Define the Cypher queries
        query_nodes = (
            "MATCH (n) "
            "RETURN id(n) AS id, elementId(n) AS elementId, properties(n) AS properties"
        )
        query_edges = (
            "MATCH (n)-[r]->(m) "
            "RETURN id(r) AS id, type(r) AS type, elementId(n) AS startId, "
            "elementId(m) AS endId, properties(r) AS properties"
        )

        # Run the Cypher queries using the run_query method
        result_nodes = neo4j_service.run_query(query_nodes)
        result_edges = neo4j_service.run_query(query_edges)
    except DatabaseError as e:
        return JsonResponse({"error": "Neo4j query error", "message": str(e)}, status=500)

    try:
        # Process the results
        nodes = [{"id": record["id"], "elementId": record["elementId"],
                  **record["properties"]} for record in result_nodes]
        edges = [{"id": record["id"], "source": record["startId"], "target": record["endId"],
                  "type": record["type"], **record["properties"]} for record in result_edges]
    except KeyError as e:
        return JsonResponse({"error": "Missing value in results", "message": str(e)}, status=500)

    # Return the data as JSON
    return JsonResponse({"nodes": nodes, "edges": edges})


@csrf_exempt
def cypher_query(request):
    """
    Run a Cypher query and optionally save it to the database.

    This function retrieves a Cypher query and a 'save' parameter from the request body.
    It runs the Cypher query and returns the results as JSON.
    If the 'save' parameter is True, it also saves the query and its results to the database.

    If a database error occurs, it returns a JSON response with an error message.

    Parameters:
    request (django.http.HttpRequest): The request object.

    Returns:
    django.http.JsonResponse: A JSON response with the query results or an error message.
    """
    try:
        # Get the Cypher query and save parameter from the request
        data = json.loads(request.body)
        cypher_query_run = data.get("cypher_query")
        natural_query_run = data.get("natural_query")
        if not natural_query:
            natural_query = "mt"
        save = data.get("save")

        # Run the Cypher query
        results = neo4j_service.run_query(cypher_query_run)
    except DatabaseError as e:
        return JsonResponse({"error": str(e)}, status=500)
    except json.JSONDecodeError as e:
        return JsonResponse({"error": f"Invalid JSON: {str(e)}"}, status=400)

    try:
        # If save is True, save the query to the database
        if save:
            for record in results:
                # Convert the record to a string and save it to the database
                # convert the first field of the record to a string
                graph = str(record[0])
                query = Query(cypher_query=cypher_query_run,
                              natural_query=natural_query_run, graph=graph)
                query.save()
    except DatabaseError as e:
        return JsonResponse({"error": f"Error saving to database: {str(e)}"}, status=500)

    # Return the results as JSON
    return JsonResponse([str(record[0]) for record in results], safe=False)


@csrf_exempt
def run_query(request):
    """
    Run a Cypher query on graph data and return the results.

    This function retrieves a Cypher query from the request body,
    sends a POST request to the graph_data URL
    to get the original graph data, runs the Cypher query on the graph data,
    and returns the new graph data as JSON.

    It only accepts POST requests. If the request method is not POST,
    it returns a JSON response with an error message.

    Parameters:
    request (django.http.HttpRequest): The request object.

    Returns:
    django.http.JsonResponse: A JSON response with the new graph data or an error message.
    """
    if request.method == "POST":
        data = json.loads(request.body)
        query = data.get("query")

        # Send a POST request to the graph_data URL
        response = requests.post("http://127.0.0.1:8000/api/graphData")
        original_graph_data = response.json()
        nodes = original_graph_data["nodes"]
        edges = original_graph_data["edges"]

        # Run the Cypher query on the graph data
        # This is a placeholder, replace with your actual logic
        new_graph_data = neo4j_service.query_graph(query)

        # Process the results
        nodes = new_graph_data[0]
        edges = new_graph_data[1]
        # Return the new graph data
        return JsonResponse({"nodes": nodes, "edges": edges}, safe=False)
    return JsonResponse({"error": "Only POST requests are allowed."}, status=500)


# -----------------------------------------------------------------------------------------------------

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

# -------------------Custom query Views---------------------#
# class CustomQueryViewSet(viewsets.ModelViewSet):
#     queryset = CustomQuery.objects.all()
#     serializer_class = CustomQuerySerializer

#     # def create(self, request, *args, **kwargs):
#     #     custom_query, errors = CustomQueryService.create_query(request.data, request)
#     #     if custom_query:
#     #         return Response (CustomQuerySerializer(custom_query).data, status = status.HTTP_201_CREATED)
#     #     return Response(errors, status = status.HTTP_400_BAD_REQUEST)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             if serializer.is_valid(raise_exception=True):
#                 self.perform_create(serializer)
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#         except IntegrityError as e:
#             raise ValidationError({"detail": str(e)})

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomQueryViewSet(viewsets.ModelViewSet):
    queryset = CustomQuery.objects.all()
    serializer_class = CustomQuerySerializer

    def create(self, request, *args, **kwargs):
        try:
            custom_query = CustomQueryService.create_custom_query(request.data)
            serializer = self.get_serializer(custom_query)
            return Response({
                'message': 'Custom query created successfully.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        try:
            custom_query = CustomQueryService.update_custom_query(
                instance, request.data)
            serializer = self.get_serializer(custom_query)
            return Response({
                'message': 'Custom query updated successfully.',
                'data': serializer.data
            })
        except ValidationError as e:
            return Response({'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'message': 'Custom query deleted successfully.'
        }, status=status.HTTP_204_NO_CONTENT)


# -------------------Folder related views---------------------#
class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def create(self, request, *args, **kwargs):
        # Use the FolderService to handle the creation logic
        folder, errors = FolderService.create_folder(request.data)

        if folder:
            return Response(FolderSerializer(folder).data, status=status.HTTP_201_CREATED)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
