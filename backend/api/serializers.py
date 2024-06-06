from logging import info
from rest_framework import serializers
from .models import CustomQuery, Folder, GraphFile, Project
from rest_framework.exceptions import ValidationError


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class GraphFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraphFile
        fields = '__all__'

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


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = '__all__'


class CustomQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomQuery
        fields = '__all__'

    def create(self, validated_data):
        project_id = self.context['request'].data.get('project_id')

    #     if not project_id:
    #         raise ValidationError({"project_id": "This field is required."})
        
    #     try:
    #         project = Project.objects.get(id=project_id)
    #         validated_data['project'] = project
    #     except Project.DoesNotExist:
    #         raise ValidationError({"project_id": f"Project with id {project_id} does not exist."})
        
    #     # check if project name is unique
    #     if CustomQuery.objects.filter(project = project, name = validated_data.get('name')).exists():
    #         raise ValidationError({"name": "A query with this name already exists in the project."})
        
    #     return super().create(validated_data)
    
    # def validate(self, attrs):
    #     if 'cypher_query' not in attrs:
    #         raise ValidationError({"cypher_query": "Cypher query is required."})
    #     if 'natural_language_query' not in attrs:
    #         raise ValidationError({"natural_language_query": "Natural language query is required."})
    #     return attrs

        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise ValidationError(
                    f"Project with id {project_id} does not exist.")
        return super().create(validated_data)
