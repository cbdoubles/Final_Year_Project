from rest_framework import viewsets, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import action
from ..serializers.folder_serializer import FolderSerializer, FoldersWithQueriesSerializer
from ..models import Folder, Project


class FolderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on Folder instances.

    Provides additional actions 'by_project' and 'folders_with_queries' to filter folders by project
    and retrieve folders along with their related queries.
    """
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get_serializer_class(self):
        """
        Returns the appropriate serializer class based on the action being performed.
        """
        if self.action == 'by_project':
            return FolderSerializer
        elif self.action == 'folders_with_queries':
            return FoldersWithQueriesSerializer
        return FolderSerializer

    @action(detail=False, methods=['get'], url_path='by-project')
    def by_project(self, request, *args, **kwargs):
        """
        Retrieve all folders for a specific project and type.

        Args:
            request (Request): The request object containing query parameters.

        Returns:
            Response: A response containing the serialized folders for the specified project and type.
        """
        project_id = request.query_params.get('project')
        folder_type = request.query_params.get('type')

        # Validate that the project_id is an integer
        try:
            project_id = int(project_id)
        except ValueError:
            raise ValidationError("Error: Project ID must be an integer.")

        # Check if a project with the provided ID exists
        if not Project.objects.filter(id=project_id).exists():
            raise ValidationError(
                "Error: A Project with this ID does not exist.")

        # Filter folders by project_id and type
        folders = Folder.objects.filter(
            project_id=project_id, type=folder_type)

        # Serialize the filtered folders
        serializer = self.get_serializer(folders, many=True)

        # Return the serialized data in the response
        return Response(serializer.data)

    @action(detail=False, methods=['get'], serializer_class=FolderSerializer, url_path='folders-with-queries')
    def folders_with_queries(self, request, *args, **kwargs):
        """
        Retrieve folders with their related queries for a specific project and type.

        Args:
            request (Request): The request object containing query parameters.

        Returns:
            Response: A response containing the serialized folders with their related queries.
        """
        project_id = request.query_params.get('project')
        folder_type = request.query_params.get('type')

        # Validate that both project_id and folder_type are provided
        if not project_id or not folder_type:
            return Response({'error': 'Project ID and type are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the folder_type
        if folder_type not in [Folder.FAVORITE, Folder.CUSTOM]:
            return Response({'error': 'Invalid type'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine the related name based on folder type
        related_name = 'favoritequery_set' if folder_type == Folder.FAVORITE else 'customquery_set'

        # Filter folders by project_id and type, and prefetch related queries
        folders = Folder.objects.filter(
            project_id=project_id, type=folder_type).prefetch_related(related_name)

        # Serialize the filtered folders with their related queries
        serializer = self.get_serializer(folders, many=True)

        # Return the serialized data in the response
        return Response(serializer.data)
