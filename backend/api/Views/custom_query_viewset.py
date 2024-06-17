from ..serializers.custom_query_serializer import CustomQuerySerializer
from ..models import CustomQuery, Folder
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action


class CustomQueryViewSet(viewsets.ModelViewSet):
    queryset = CustomQuery.objects.all()
    serializer_class = CustomQuerySerializer

    # An action that allows you to get all custom queries in a specific folder.
    # Example usage: http://127.0.0.1:8000/api/custom-queries/by-folder/?folder_id=6
    @action(detail=False, methods=['get'], url_path='by-folder')
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
        if not Folder.objects.filter(id=folder_id).exists():
            raise ValidationError(
                "Error: A Folder with this ID does not exist.")

        custom_queries = CustomQuery.objects.filter(folder_id=folder_id)
        serializer = self.get_serializer(custom_queries, many=True)
        return Response(serializer.data)
