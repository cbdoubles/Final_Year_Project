from rest_framework import serializers
from ..models import DefaultQuery


class DefaultQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultQuery
        fields = ['id', 'name', 'cypher_query', 'natural_language_query']
