from rest_framework import viewsets
from ..models import DefaultQuery
from ..serializers.default_query_serializer import DefaultQuerySerializer

# Example usage: http://localhost:8000/api/default-queries/
# ReadOnlyModelViewSet provides the 'read-only' actions, .list() and .retrieve().


class DefaultQueryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DefaultQuery.objects.all()
    serializer_class = DefaultQuerySerializer
