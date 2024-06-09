import os
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from .models import Project, GraphFile
from .serializers import CustomQuerySerializer, FolderSerializer, ProjectSerializer, GraphFileSerializer


class ProjectService:
    @staticmethod
    def create_project(data, request):
        project_serializer = ProjectSerializer(data=data)
        if project_serializer.is_valid():
            return project_serializer.save(), None
        return None, project_serializer.errors

    @staticmethod
    def update_project(instance, data, partial):
        project_serializer = ProjectSerializer(
            instance, data=data, partial=partial)
        if project_serializer.is_valid():
            return project_serializer.save(), None
        return None, project_serializer.errors

    @staticmethod
    def delete_project(project):
        project.delete()


class FileService:
    @staticmethod
    def upload_file(project, request):
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
    def reupload_file(project, request):
        file = GraphFile.objects.get(project=project)
        if file.file_path and os.path.isfile(file.file_path.path):
            os.remove(file.file_path.path)
        file_data = {
            'project': project.id,
            'file_type': request.data.get('file_type'),
            'file_path': request.FILES['file_path'],
        }
        file_serializer = GraphFileSerializer(
            file, data=file_data, context={'request': request})
        if file_serializer.is_valid():
            return file_serializer.save(), None
        return None, file_serializer.errors

    @staticmethod
    def delete_file(project):
        file = GraphFile.objects.filter(project=project)
        if file:
            try:
                if file.file_path and os.path.isfile(file.file_path.path):
                    os.remove(file.file_path.path)
                file.delete()
            except Exception as e:
                return None, f"Error deleting file: {e}"
        return None, "No file found for this project"


class CustomQueryService:
    @staticmethod
    def create_query(data, request):
        custom_query_serializer = CustomQuerySerializer(
            data=data, context={'request': request})
        if custom_query_serializer.is_valid():
            return custom_query_serializer.save(), None
        return None, custom_query_serializer.errors


class FolderService:
    @staticmethod
    def create_folder(data):
        serializer = FolderSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            try:
                folder = serializer.save()
                return folder, None
            except IntegrityError as e:
                raise ValidationError({"detail": str(e)})
        return None, serializer.errors
