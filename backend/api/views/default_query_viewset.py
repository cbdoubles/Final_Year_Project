from rest_framework import viewsets
from ..models import DefaultQuery
from ..serializers.default_query_serializer import DefaultQuerySerializer

# Example usage: http://localhost:8000/api/default-queries/


class DefaultQueryViewSet(viewsets.ModelViewSet):
    queryset = DefaultQuery.objects.all()
    serializer_class = DefaultQuerySerializer
