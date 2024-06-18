from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from ..models import Project
from ..serializers.project_serializer import ProjectSerializer
from ..file_services import modify_file


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        try:
            # Retrieve the file from the request
            file = request.FILES.get('file')

            # Check if the file is provided
            if not file:
                return Response({'error': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate the data using the serializer
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            project = serializer.save()

            # Send the project ID and file to the method "modify_file"
            modify_file(project.id, file, False)

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
                modify_file(project.id, file, reupload=True)

            serializer = self.get_serializer(project, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            project.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
