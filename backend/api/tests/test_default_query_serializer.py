import pytest
from django.db.utils import IntegrityError
from rest_framework.exceptions import ValidationError
from ..models import DefaultQuery
from ..serializers.default_query_serializer import DefaultQuerySerializer

@pytest.mark.django_db
def test_default_query_serializer_create():
    serializer = DefaultQuerySerializer()

    # Create a default query with valid data
    default_query_data = {
        'name': 'Test Default Query',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    created_default_query = serializer.create(default_query_data)

    # Check if default query is created correctly
    assert DefaultQuery.objects.filter(name='Test Default Query').exists()
    assert created_default_query.name == 'Test Default Query'
    assert created_default_query.cypher_query == 'MATCH (n) RETURN n'
    assert created_default_query.natural_language_query == 'Find all nodes'

@pytest.mark.django_db
def test_default_query_serializer_validation():
    serializer = DefaultQuerySerializer()

    # Attempt to validate the serializer with invalid data (missing name)
    invalid_data = {
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    with pytest.raises(ValidationError):
        serializer.validate(invalid_data)

@pytest.mark.django_db
def test_default_query_serializer_unique_constraint():
    serializer = DefaultQuerySerializer()

    # Create a default query
    default_query_data = {
        'name': 'Unique Default Query',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    serializer.create(default_query_data)

    # Try to create another default query with the same name (should raise IntegrityError)
    duplicate_default_query_data = {
        'name': 'Unique Default Query',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    with pytest.raises(IntegrityError):
        serializer.create(duplicate_default_query_data)
