from backend.api.serializers.custom_query_serializer import CustomQuerySerializer
from backend.api.serializers.favorite_query_serializer import FavoriteQuerySerializer
from rest_framework import serializers
from ..models import Folder, Project
from rest_framework.exceptions import ValidationError


class FolderSerializer(serializers.ModelSerializer):
    """
    Serializer for the Folder model.

    This serializer handles the conversion of Folder instances to and from JSON format,
    as well as data validation and creation.
    """

    class Meta:
        model = Folder
        # Fields to be serialized
        fields = "__all__"

    def create(self, validated_data):
        """
        Override the create method to handle custom project assignment.

        Checks if a project_id is provided in the request data, and assigns the corresponding
        Project instance to the validated_data. Raises a ValidationError if the project does not exist.
        """
        project_id = self.context['request'].data.get('project_id')
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise ValidationError(
                    f"Project with id {project_id} does not exist."
                )
        return super().create(validated_data)


class FoldersWithQueriesSerializer(serializers.ModelSerializer):
    """
    Serializer for the Folder model, including related queries.

    This serializer handles the conversion of Folder instances to and from JSON format,
    data validation, and creation. It also includes a custom method to retrieve related queries.
    """
    queries = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ['id', 'name', 'queries']

    def create(self, validated_data):
        """
        Override the create method to handle custom project assignment.

        Checks if a project_id is provided in the request data, and assigns the corresponding
        Project instance to the validated_data. Raises a ValidationError if the project does not exist.
        """
        project_id = self.context['request'].data.get('project_id')
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise ValidationError(
                    f"Project with id {project_id} does not exist."
                )
        return super().create(validated_data)

    def get_queries(self, obj):
        """
        Retrieve related queries based on the type of the folder.

        If the folder type is FAVORITE, it retrieves FavoriteQuery instances;
        otherwise, it retrieves CustomQuery instances.
        """
        related_name = 'favoritequery_set' if obj.type == Folder.FAVORITE else 'customquery_set'
        QuerySerializer = FavoriteQuerySerializer if obj.type == Folder.FAVORITE else CustomQuerySerializer
        return QuerySerializer(getattr(obj, related_name).all(), many=True).data
