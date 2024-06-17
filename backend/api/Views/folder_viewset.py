from ..Serializers.serializers import FolderSerializer, FoldersWithQueriesSerializer
from ..models import Folder, Project
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action


class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get_serializer_class(self):
        if self.action == 'by_project':
            print("folder by project")
            return FolderSerializer
        elif self.action == 'folders_with_queries':
            print("folder with queries")
            return FoldersWithQueriesSerializer
        return FolderSerializer

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
            raise ValidationError(
                "Error: A Project with this ID does not exist.")

        # filter folders by project_id
        folders = Folder.objects.filter(
            project_id=project_id, type=folder_type)
        serializer = self.get_serializer(folders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], serializer_class=FolderSerializer, url_path='folders-with-queries')
    # Example usage: http://127.0.0.1:8000/api/folders/folders-with-queries/?project=42&type=Custom
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
