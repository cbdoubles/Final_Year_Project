from rest_framework import serializers
from ..models import *
from rest_framework.exceptions import ValidationError


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


class FavoriteQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteQuery
        # Expected fields in the request
        fields = ['id', 'project', 'folder', 'name',
                  'cypher_query', 'natural_language_query']


class CustomQuerySerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all())
    folder = serializers.PrimaryKeyRelatedField(queryset=Folder.objects.all())

    class Meta:
        model = CustomQuery
        # Expected fields in the request
        fields = ['id', 'project', 'folder', 'name',
                  'cypher_query', 'natural_language_query']


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        # Expected fields in the request
        fields = "__all__"

    def create(self, validated_data):
        project_id = self.context['request'].data.get('project_id')
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise ValidationError(
                    f"Project with id {project_id} does not exist.")
        return super().create(validated_data)


class FoldersWithQueriesSerializer(serializers.ModelSerializer):
    queries = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ['id', 'name', 'queries']

    def create(self, validated_data):
        project_id = self.context['request'].data.get('project_id')
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise ValidationError(
                    f"Project with id {project_id} does not exist.")
        return super().create(validated_data)

    def get_queries(self, obj):
        related_name = 'favoritequery_set' if obj.type == Folder.FAVORITE else 'customquery_set'
        QuerySerializer = FavoriteQuerySerializer if obj.type == Folder.FAVORITE else CustomQuerySerializer
        return QuerySerializer(getattr(obj, related_name).all(), many=True).data
