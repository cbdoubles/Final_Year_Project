import os
import json
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import viewsets, status
from .serializers import ProjectSerializer, GraphFileSerializer, FolderSerializer
from .models import Project, GraphFile, Folder
from .neo4j_services import Neo4jService
from .upload_file import process_file
from .services import ProjectService, FileService
import logging
#TODO: refactor the classes in a different folder


# Get Neo4j parameters from environment variables
neo4j_user = os.getenv('NEO4J_USER')
neo4j_password = os.getenv('NEO4J_PASSWORD')
neo4j_service = Neo4jService('bolt://localhost:7687', neo4j_user, neo4j_password)
neo4j_dir = os.environ.get('NEO4J_HOME')

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('json_file'):
        uploaded_file = request.FILES['json_file']
        file_name = uploaded_file.name
        project_id = request.POST.get('project_id')

        # Define the path to the downloads directory within the Neo4j directory
        downloads_dir = os.path.join(neo4j_dir, 'downloads')

        # Construct the file path
        file_path = os.path.join(downloads_dir, file_name)
        file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'

        # Create the directory if it doesn't exist
        if not os.path.exists(os.path.dirname(file_path)):
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save the uploaded file to the file path
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Process the file
        process_file(file_name, project_id)
    
        return FileResponse(open(file_path, 'rb'))
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request'}, status=400)

@csrf_exempt
def graph_data(request):
    try:
        query_nodes = """
        CALL apoc.export.json.query(
            "MATCH (n) 
            RETURN collect({data: {id: elementId(n), label: properties(n).labels, properties: apoc.map.removeKey(properties(n), 'labels')}}) AS nodes", 
            null, 
            {stream: true}
        )
        """

        query_edges = """
        CALL apoc.export.json.query(
            "MATCH (n)-[r]->(m) 
            RETURN collect({data: {id: elementId(r), source: elementId(startNode(r)), target: elementId(endNode(r)), label: type(r), properties: apoc.map.removeKey(properties(r), 'label')}}) AS edges", 
            null, 
            {stream: true}
        )
        """
        result_nodes = neo4j_service.run_query(query_nodes)[0]
        result_edges = neo4j_service.run_query(query_edges)[0]

        print(f"result_nodes: {result_nodes}")
        print(f"result_edges: {result_edges}")

        nodes_data_str = result_nodes['data']
        edges_data_str = result_edges['data']

        # Process the results
        nodes_data = json.loads(nodes_data_str)
        edges_data = json.loads(edges_data_str)

        # Prepare the graph data
        graph_data = {
            "nodes": nodes_data["nodes"],
            "edges": edges_data["edges"]
        }

        # Return the data as JSON
        return JsonResponse(graph_data)
    except Exception as e:
        return JsonResponse({'error': 'Neo4j query error', 'message': str(e)}, status=500)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = (MultiPartParser, FormParser)

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

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


class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # data[Project] = Project.objects.get(id=data[Project])
