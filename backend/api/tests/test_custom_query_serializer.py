import pytest
from django.core.exceptions import ValidationError
from ..serializers.custom_query_serializer import CustomQuerySerializer
from ..models import CustomQuery, Project, Folder

pytestmark = pytest.mark.django_db

def test_custom_query_serializer_valid():
    project = Project.objects.create(name='Test Project', file_name='test_file')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.CUSTOM)
    
    data = {
        'project': project.pk,
        'folder': folder.pk,
        'name': 'Test Query',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Retrieve all nodes'
    }
    
    serializer = CustomQuerySerializer(data=data)
    assert serializer.is_valid()

    instance = serializer.save()
    assert isinstance(instance, CustomQuery)
    assert instance.name == 'Test Query'

    serialized_data = serializer.data
    deserialized_serializer = CustomQuerySerializer(data=serialized_data)
    assert deserialized_serializer.is_valid()
    deserialized_instance = deserialized_serializer.save()
    assert isinstance(deserialized_instance, CustomQuery)
    assert deserialized_instance.name == 'Test Query'


def test_custom_query_serializer_invalid():
    # Invalid data: missing required fields
    invalid_data = {
        'project': 1,  # Assuming project with pk=1 doesn't exist
        'folder': 2,   # Assuming folder with pk=2 doesn't exist
        'cypher_query': 'MATCH (n) RETURN n'
        # 'name' and 'natural_language_query' are missing
    }
    
    serializer = CustomQuerySerializer(data=invalid_data)
    assert not serializer.is_valid()
    assert 'name' in serializer.errors
    assert 'natural_language_query' in serializer.errors
    assert 'project' in serializer.errors
    assert 'folder' in serializer.errors

    # Invalid data: non-existent project and folder
    invalid_data['name'] = 'Invalid Query'
    invalid_data['natural_language_query'] = 'Invalid query'
    
    serializer = CustomQuerySerializer(data=invalid_data)
    assert not serializer.is_valid()
    assert 'project' in serializer.errors
    assert 'folder' in serializer.errors


def test_custom_query_serializer_edge_cases():
    # Test case for null values
    data_with_nulls = {
        'project': None,
        'folder': None,
        'name': 'Query with Nulls',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': None
    }
    
    serializer = CustomQuerySerializer(data=data_with_nulls)
    assert serializer.is_valid()

    instance = serializer.save()
    assert instance.project is None
    assert instance.folder is None
    assert instance.natural_language_query is None
