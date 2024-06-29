from rest_framework import serializers
from ..models import FavoriteQuery


class FavoriteQuerySerializer(serializers.ModelSerializer):
    class Meta:
        """
        Meta class to specify the model and fields to be used in the serializer.
        """
        model = FavoriteQuery
        # Expected fields in the request
        fields = ['id', 'project', 'folder', 'name',
                  'cypher_query', 'natural_language_query']
