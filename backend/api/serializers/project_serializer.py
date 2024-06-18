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
            project=project, name='Project Custom Queires', type='Custom')
        Folder.objects.create(
            project=project, name='Project Favorite Queries', type='Favorite')

        return project
