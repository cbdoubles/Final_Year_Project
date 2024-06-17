from rest_framework import serializers
from ..models import CustomQuery, Project, Folder


class CustomQuerySerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all())
    folder = serializers.PrimaryKeyRelatedField(queryset=Folder.objects.all())

    class Meta:
        model = CustomQuery
        # Expected fields in the request
        fields = ['id', 'project', 'folder', 'name',
                  'cypher_query', 'natural_language_query']
