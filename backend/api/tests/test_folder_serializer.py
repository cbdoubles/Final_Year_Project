import pytest
from django.core.exceptions import ValidationError
from ..models import Folder, Project, CustomQuery, FavoriteQuery
from ..serializers.folder_serializer import FolderSerializer, FoldersWithQueriesSerializer


@pytest.mark.django_db
def test_folder_serializer_create_with_valid_project_id():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    serializer = FolderSerializer(context={'request': {'data': {'project_id': project.id}}})

    # Create a folder with valid project_id
    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    created_folder = serializer.create(folder_data)

    # Check if folder is created correctly
    assert Folder.objects.filter(name='Test Folder').exists()
    assert created_folder.name == 'Test Folder'
    assert created_folder.type == Folder.CUSTOM
    assert created_folder.project == project

@pytest.mark.django_db
def test_folder_serializer_create_with_invalid_project_id():
    serializer = FolderSerializer(context={'request': {'data': {'project_id': 999}}})

    # Attempt to create a folder with invalid project_id
    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    with pytest.raises(ValidationError):
        serializer.create(folder_data)

@pytest.mark.django_db
def test_folder_serializer_create_without_project_id():
    serializer = FolderSerializer(context={'request': {'data': {}}})

    # Create a folder without project_id
    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    created_folder = serializer.create(folder_data)

    # Check if folder is created correctly (should not associate with any project)
    assert Folder.objects.filter(name='Test Folder').exists()
    assert created_folder.name == 'Test Folder'
    assert created_folder.type == Folder.CUSTOM
    assert created_folder.project is None

@pytest.mark.django_db
def test_folders_with_queries_serializer_create_with_valid_project_id():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    serializer = FoldersWithQueriesSerializer(context={'request': {'data': {'project_id': project.id}}})

    # Create a folder with valid project_id
    folder_data = {
        'name': 'Test Folder',
        'type': Folder.FAVORITE,  # Testing with FAVORITE type
    }
    created_folder = serializer.create(folder_data)

    # Check if folder is created correctly
    assert Folder.objects.filter(name='Test Folder').exists()
    assert created_folder.name == 'Test Folder'
    assert created_folder.type == Folder.FAVORITE
    assert created_folder.project == project

@pytest.mark.django_db
def test_folders_with_queries_serializer_create_with_invalid_project_id():
    serializer = FoldersWithQueriesSerializer(context={'request': {'data': {'project_id': 999}}})

    # Attempt to create a folder with invalid project_id
    folder_data = {
        'name': 'Test Folder',
        'type': Folder.FAVORITE,
    }
    with pytest.raises(ValidationError):
        serializer.create(folder_data)

@pytest.mark.django_db
def test_folders_with_queries_serializer_create_without_project_id():
    serializer = FoldersWithQueriesSerializer(context={'request': {'data': {}}})

    # Create a folder without project_id
    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,  # Testing with CUSTOM type
    }
    created_folder = serializer.create(folder_data)

    # Check if folder is created correctly (should not associate with any project)
    assert Folder.objects.filter(name='Test Folder').exists()
    assert created_folder.name == 'Test Folder'
    assert created_folder.type == Folder.CUSTOM
    assert created_folder.project is None

@pytest.mark.django_db
def test_folders_with_queries_serializer_get_queries_custom():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Custom Folder', type=Folder.CUSTOM)
    CustomQuery.objects.create(project=project, folder=folder, name='Test Query', cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes')
    serializer = FoldersWithQueriesSerializer()

    # Retrieve queries for the custom folder
    serialized_data = serializer.get_queries(folder)

    # Check if the query is retrieved correctly
    assert len(serialized_data) == 1
    assert serialized_data[0]['name'] == 'Test Query'

@pytest.mark.django_db
def test_folders_with_queries_serializer_get_queries_favorite():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Favorite Folder', type=Folder.FAVORITE)
    FavoriteQuery.objects.create(project=project, folder=folder, name='Test Query', cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes')
    serializer = FoldersWithQueriesSerializer()

    # Retrieve queries for the favorite folder
    serialized_data = serializer.get_queries(folder)

    # Check if the query is retrieved correctly
    assert len(serialized_data) == 1
    assert serialized_data[0]['name'] == 'Test Query'
