from rest_framework import serializers
from ..models import Project, Folder


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        # Only the fields needed for the database
        fields = ['id', 'name', 'file_name']

    def create(self, validated_data):
        # Create the Project instance
        project = Project.objects.create(**validated_data)

        # Create default folders
        Folder.objects.create(
            project=project, name='Project Custom Queries', type='Custom')
        Folder.objects.create(
            project=project, name='Project Favorite Queries', type='Favorite')

        return project


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.

    This serializer handles the conversion of Project instances to and from JSON format,
    as well as data validation and creation. It also creates default folders for each new project.
    """

    class Meta:
        model = Project
        # Fields to be serialized
        fields = ['id', 'name', 'file_name']

    def create(self, validated_data):
        """
        Override the create method to handle custom project creation.

        Creates a new Project instance and also creates default folders associated with the project.
        """
        # Create the Project instance
        project = Project.objects.create(**validated_data)

        # Create default folders associated with the project
        Folder.objects.create(
            project=project, name='Project Custom Queries', type='Custom'
        )
        Folder.objects.create(
            project=project, name='Project Favorite Queries', type='Favorite'
        )

        return project
