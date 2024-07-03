from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from ..models import Project
from ..serializers.project_serializer import ProjectSerializer
from ..file_services import FileService


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on Project instances.

    This ViewSet provides the standard actions .list(), .create(), .retrieve(), .update(),
    .partial_update(), and .destroy(). It also handles file uploads and re-upload.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        """
        Handle the creation of a new Project instance.

        This method handles file uploads, validates the data, saves the project to the SQL database,
        and sends the project ID and file to the modify_file method.

        Args:
            request (Request): The request object containing data and files.

        Returns:
            Response: A response containing the serialized project data or an error message.
        """
        try:
            # Retrieve the file from the request
            file = request.FILES.get('file')

            # Check if the file is provided
            if not file:
                return Response({'error': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate the data using the serializer
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            # Create the project instance in the database
            project = serializer.save()

            # Send the project ID and file to the method "modify_file"
            file_service = FileService()
            file_service.modify_file(project.id, file, False)

            # Return the serialized project data
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            # Handle validation errors
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle unexpected errors and include the exception message
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, *args, **kwargs):
        """
        Handle the partial update of an existing Project instance.

        This method updates the project's name, file_name, and handles file re-uploads.

        Args:
            request (Request): The request object containing data and files.

        Returns:
            Response: A response containing the serialized project data or an error message.
        """
        try:
            # Retrieve the project instance to be updated
            project = self.get_object()
            data = request.data

            # Update project name if provided
            if 'name' in data:
                project.name = data['name']

            # Update project file_name if provided
            if 'file_name' in data:
                project.file_name = data['file_name']

            # Handle file reuploads if a file is provided
            if 'file' in request.FILES:
                file = request.FILES.get('file')
                file_service = FileService()
                file_service.modify_file(project.id, file, reupload=True)

            # Validate the updated data using the serializer
            serializer = self.get_serializer(project, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            project.save()

            # Return the serialized project data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            # Handle validation errors
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle unexpected errors and include the exception message
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
