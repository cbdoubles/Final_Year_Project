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
from rest_framework.decorators import action
from py2neo import DatabaseError
from django.conf import settings
from .serializers import *
from .models import *
from .neo4j_services import Neo4jService
from django.db import IntegrityError
from .upload_file import process_file
from .services import *
import logging
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import CustomQuery
from .serializers import CustomQuerySerializer
from rest_framework.decorators import action


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

# ------------------------------------ALL CRUD VIEW SETS----------------------------------------------------#

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):

        try:
            # retreive the file from the request
            file = request.FILES.get('file')

            # check if the file is provided
            if not file:
                return Response({'error': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if the uploaded file format is valid
            valid_formats = ['graphml', 'json', 'csv']
            file_extension = file.name.split('.')[-1].lower()
            if file_extension not in valid_formats:
                print("bad response bad file format")
                return Response(
                    {"error": "Invalid file format. Only graphML, JSON, and CSV files are allowed."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Save the file on the server
            file_path = os.path.join(settings.MEDIA_ROOT, file.name)
            #file_path = f'C:/webapp/project_files/{file.name}'
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            
            # Validate the data using the serializer
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            project = serializer.save()

            # Send the project ID and file path to the method "modify_input_file"
            modify_input_file(project.id, file_path)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the exception here as needed
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def partial_update(self, request, *args, **kwargs):
        try:
            project = self.get_object()
            data = request.data

            if 'name' in data:
                project.name = data['name']
            
            if 'file_name' in data:
                project.file_name = data['file_name']

            if 'file' in request.FILES:
                file = request.FILES.get('file')

                # Check if the uploaded file format is valid
                valid_formats = ['graphml', 'json', 'csv']
                file_extension = file.name.split('.')[-1].lower()
                if file_extension not in valid_formats:
                    print("bad response bad file format")
                    return Response(
                        {"error": "Invalid file format. Only graphML, JSON, and CSV files are allowed."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                file_path = os.path.join(settings.MEDIA_ROOT, file.name)
                with open(file_path, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)

            serializer = self.get_serializer(project, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            project.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            

#--------------------------- Here we go again -------------------------------------------#
class FavoriteQueryViewSet(viewsets.ModelViewSet):
    queryset = FavoriteQuery.objects.all()
    serializer_class = FavoriteQuerySerializer

    # An action that allows you to get all favorite queries in a specific folder.
    # Example usage: http://127.0.0.1:8000/api/favorite-queries/by-folder/?folder_id=6
    @action(detail=False, methods=['get'], url_path='by-folder')
    def by_folder(self, request):

        ''' 
        This does not check if the id of the folder provided is one of a folder for 
        favorite queries. So if the folder_id provided is one of a Custom folder,
        the response will be an empty list.
        '''

        folder_id = request.query_params.get('folder_id')

        try:
            folder_id = int(folder_id)
        except ValueError:
            raise ValidationError("Error: Folder ID must be an integer.")
        
        # check if a folder with this id exists
        if not Folder.objects.filter(id = folder_id).exists():
            raise ValidationError("Error: A Folder with this ID does not exist.")

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


        favorite_queries = FavoriteQuery.objects.filter(folder_id = folder_id)
        serializer = self.get_serializer(favorite_queries, many=True)
        return Response(serializer.data)


#--------------------------- Custom Query Views -------------------------------------------#
class CustomQueryViewSet(viewsets.ModelViewSet):
    queryset = CustomQuery.objects.all()
    serializer_class = CustomQuerySerializer

    # An action that allows you to get all custom queries in a specific folder.
    # Example usage: http://127.0.0.1:8000/api/custom-queries/by-folder/?folder_id=6
    @action(detail=False, methods = ['get'], url_path='by-folder')
    def by_folder(self, request):

        ''' 
        This does not check if the id of the folder provided is one of a folder that
        belongs to Custom folder. So if the folder_id provided is one of a Favorite folder,
        the response will be an empty list.
        '''

        folder_id = request.query_params.get('folder_id')    

        try:
            folder_id = int(folder_id)
        except ValueError:
            raise ValidationError("Error: Folder ID must be an integer.")
        
        # check if a folder with this id exists
        if not Folder.objects.filter(id = folder_id).exists():
            raise ValidationError("Error: A Folder with this ID does not exist.")

        custom_queries = CustomQuery.objects.filter(folder_id = folder_id)
        serializer = self.get_serializer(custom_queries, many=True)
        return Response(serializer.data)


#---------------------------------- Folder Views -------------------------------------------#
class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get_serializer_class(self):
        if self.action == 'by_project':
            return FolderSerializer
        elif self.action == 'folders_with_queries':
            return FoldersWithQueriesSerializer  
        return super().get_serializer_class()

    
    @action(detail=False, methods=['get'], url_path='by-project')
    # Example usage: http://127.0.0.1:8000/api/folders/by-project/?project=42&type=Custom
    def by_project(self, request, *args, **kwargs):

        project_id = request.query_params.get('project')
        folder_type = request.query_params.get('type')

        try:
            project_id = int(project_id)
        except ValueError:
            raise ValidationError("Error: Project ID must be an integer.")
        
        # check if a project with this id exists
        if not Project.objects.filter(id=project_id).exists():
            raise ValidationError("Error: A Project with this ID does not exist.")
        
        # filter folders by project_id
        folders = Folder.objects.filter(project_id=project_id, type = folder_type)
        serializer = self.get_serializer(folders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], serializer_class=FolderSerializer, url_path='folders-with-queries')
    # Example usage: http://127.0.0.1:8000/api/folders/by-project/?project=42&type=Custom
    def folders_with_queries(self, request, *args, **kwargs):
        project_id = request.query_params.get('project')
        folder_type = request.query_params.get('type')

        if not project_id or not folder_type:
            return Response({'error': 'Project ID and type are required'}, status=status.HTTP_400_BAD_REQUEST)

        if folder_type not in [Folder.FAVORITE, Folder.CUSTOM]:
            return Response({'error': 'Invalid type'}, status=status.HTTP_400_BAD_REQUEST)

        related_name = 'favoritequery_set' if folder_type == Folder.FAVORITE else 'customquery_set'
        folders = Folder.objects.filter(
               project_id=project_id, type=folder_type).prefetch_related(related_name)

        serializer = self.get_serializer(folders, many=True)
        return Response(serializer.data)
