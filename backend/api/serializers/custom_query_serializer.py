from rest_framework import serializers
from ..models import CustomQuery, Project, Folder


class CustomQuerySerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomQuery model.
    This serializer handles the conversion of CustomQuery instances to and from JSON format,
    as well as data validation.
    """
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all()
    )
    folder = serializers.PrimaryKeyRelatedField(
        queryset=Folder.objects.all()
    )

    class Meta:
        """
        Meta class to specify the model and fields to be used in the serializer.
        """
        model = CustomQuery
        # Fields to be serialized
        fields = [
            'id',
            'project',
            'folder',
            'name',
            'cypher_query',
            'natural_language_query'
        ]
