import pytest
from django.db.utils import IntegrityError
from rest_framework.exceptions import ValidationError
from ..models import Project, Folder, FavoriteQuery
from ..serializers.favorite_query_serializer import FavoriteQuerySerializer

@pytest.mark.django_db
def test_favorite_query_serializer_create():
    serializer = FavoriteQuerySerializer()

    # Create a project and folder
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.FAVORITE)

    # Create a favorite query with valid data
    favorite_query_data = {
        'project': project.id,
        'folder': folder.id,
        'name': 'Test Favorite Query',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    created_favorite_query = serializer.create(favorite_query_data)

    # Check if favorite query is created correctly
    assert FavoriteQuery.objects.filter(name='Test Favorite Query').exists()
    assert created_favorite_query.name == 'Test Favorite Query'
    assert created_favorite_query.cypher_query == 'MATCH (n) RETURN n'
    assert created_favorite_query.natural_language_query == 'Find all nodes'
    assert created_favorite_query.project == project
    assert created_favorite_query.folder == folder

@pytest.mark.django_db
def test_favorite_query_serializer_validation():
    serializer = FavoriteQuerySerializer()

    # Create a project and folder
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.FAVORITE)

    # Attempt to validate the serializer with invalid data (missing name)
    invalid_data = {
        'project': project.id,
        'folder': folder.id,
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    with pytest.raises(ValidationError):
        serializer.validate(invalid_data)

@pytest.mark.django_db
def test_favorite_query_serializer_unique_constraint():
    serializer = FavoriteQuerySerializer()

    # Create a project and folder
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.FAVORITE)

    # Create a favorite query
    favorite_query_data = {
        'project': project.id,
        'folder': folder.id,
        'name': 'Unique Favorite Query',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    serializer.create(favorite_query_data)

    # Try to create another favorite query with the same name under the same folder (should raise IntegrityError)
    duplicate_favorite_query_data = {
        'project': project.id,
        'folder': folder.id,
        'name': 'Unique Favorite Query',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Find all nodes',
    }
    with pytest.raises(IntegrityError):
        serializer.create(duplicate_favorite_query_data)
