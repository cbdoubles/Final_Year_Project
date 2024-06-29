from rest_framework import serializers
from ..models import DefaultQuery


class DefaultQuerySerializer(serializers.ModelSerializer):
    """
    Serializer for the DefaultQuery model.

    This serializer handles the conversion of DefaultQuery instances to and from JSON format,
    as well as data validation.
    """

    class Meta:
        """
        Meta class to specify the model and fields to be used in the serializer.
        """
        model = DefaultQuery
        # Fields to be serialized
        fields = [
            'id',
            'name',
            'cypher_query',
            'natural_language_query'
        ]
