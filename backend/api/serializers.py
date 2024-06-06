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
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise ValidationError(
                    f"Project with id {project_id} does not exist.")
        return super().create(validated_data)
