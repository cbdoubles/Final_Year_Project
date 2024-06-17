from rest_framework import serializers
from ..models import Folder, Project
from rest_framework.exceptions import ValidationError


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
