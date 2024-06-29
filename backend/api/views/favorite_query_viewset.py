from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import FavoriteQuery, Folder
from ..serializers.favorite_query_serializer import FavoriteQuerySerializer


class FavoriteQueryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on FavoriteQuery instances.

    Provides an additional action 'by_folder' to retrieve favorite queries by folder.
    """
    queryset = FavoriteQuery.objects.all()
    serializer_class = FavoriteQuerySerializer

    @action(detail=False, methods=['get'], url_path='by-folder')
    def by_folder(self, request):
        """
        Retrieve all favorite queries in a specific folder.

        This action does not verify if the folder belongs to the Favorite folder category.
        If the folder_id provided corresponds to a Custom folder, the response will be an empty list.

        Args:
            request (Request): The request object containing query parameters.

        Returns:
            Response: A response containing the serialized favorite queries for the specified folder.
        """
        folder_id = request.query_params.get('folder_id')

        # Validate that the folder_id is an integer
        try:
            folder_id = int(folder_id)
        except ValueError:
            raise ValidationError("Error: Folder ID must be an integer.")

        # Check if a folder with the provided ID exists
        if not Folder.objects.filter(id=folder_id).exists():
            raise ValidationError(
                "Error: A Folder with this ID does not exist.")

        # Retrieve favorite queries for the specified folder
        favorite_queries = FavoriteQuery.objects.filter(folder_id=folder_id)

        # Serialize the favorite queries
        serializer = self.get_serializer(favorite_queries, many=True)

        # Return the serialized data in the response
        return Response(serializer.data)
