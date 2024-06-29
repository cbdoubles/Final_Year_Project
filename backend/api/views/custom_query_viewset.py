from ..serializers.custom_query_serializer import CustomQuerySerializer
from ..models import CustomQuery, Folder
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action


class CustomQueryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on CustomQuery instances.

    Provides an additional action 'by_folder' to retrieve custom queries in a specific folder.
    """
    queryset = CustomQuery.objects.all()
    serializer_class = CustomQuerySerializer

    @action(detail=False, methods=['get'], url_path='by-folder')
    def by_folder(self, request):
        """
        Retrieve all custom queries in a specific folder.

        This action does not verify if the folder belongs to the Custom folder category.
        If the folder_id provided corresponds to a Favorite folder, the response will be an empty list.

        Args:
            request (Request): The request object containing query parameters.

        Returns:
            Response: A response containing the serialized custom queries for the specified folder.
        """
        folder_id = request.query_params.get('folder_id')

        try:
            folder_id = int(folder_id)
        except ValueError:
            raise ValidationError("Error: Folder ID must be an integer.")

        # Check if a folder with the provided ID exists
        if not Folder.objects.filter(id=folder_id).exists():
            raise ValidationError(
                "Error: A Folder with this ID does not exist.")

        # Retrieve custom queries for the specified folder
        custom_queries = CustomQuery.objects.filter(folder_id=folder_id)
        serializer = self.get_serializer(custom_queries, many=True)
        return Response(serializer.data)
