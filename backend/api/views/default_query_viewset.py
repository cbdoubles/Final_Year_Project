from rest_framework import viewsets
from ..models import DefaultQuery
from ..serializers.default_query_serializer import DefaultQuerySerializer


class DefaultQueryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for handling read-only operations on DefaultQuery instances.

    This ViewSet provides the 'read-only' actions: .list() and .retrieve().

    - .list() returns a list of all DefaultQuery instances.
    - .retrieve() returns a specific DefaultQuery instance by ID.

    """
    queryset = DefaultQuery.objects.all()
    serializer_class = DefaultQuerySerializer
