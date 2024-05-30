import os
from rest_framework.exceptions import ValidationError
from .models import Project, GraphFile
from .serializers import ProjectSerializer, GraphFileSerializer

class ProjectService:
    @staticmethod
    def create_project(data, request):
        project_serializer = ProjectSerializer(data=data)
        if project_serializer.is_valid():
            return project_serializer.save(), None
        return None, project_serializer.errors

    @staticmethod
    def update_project(instance, data, partial):
        project_serializer = ProjectSerializer(instance, data=data, partial=partial)
        if project_serializer.is_valid():
            return project_serializer.save(), None
        return None, project_serializer.errors

    @staticmethod
    def delete_project(project):
        project.delete()

class FileService:
    @staticmethod
    def create_graph_file(project, request):
        file_data = {
            'project': project.id,
            'file_type': request.data.get('file_type'),
            'file_path': request.FILES['file_path'],
        }
        file_serializer = GraphFileSerializer(
            data=file_data, context={'request': request})
        if file_serializer.is_valid():
            return file_serializer.save(), None
        return None, file_serializer.errors
    
    @staticmethod
    def delete_file(project):
        files = GraphFile.objects.filter(project=project)
        for file in files:
            if file.file_path and os.path.isfile(file.file_path.path):
                os.remove(file.file_path.path)