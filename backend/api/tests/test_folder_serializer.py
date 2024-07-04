import pytest
from django.core.exceptions import ValidationError
from ..models import Folder, Project, CustomQuery, FavoriteQuery
from ..serializers.folder_serializer import FolderSerializer, FoldersWithQueriesSerializer


@pytest.mark.django_db
def test_folder_serializer_create_with_valid_project_id():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    request = type('Request', (object,), {'data': {'project_id': project.id}})
    context = {'request': request}
    serializer = FolderSerializer(context=context)

    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    created_folder = serializer.create(folder_data)

    assert Folder.objects.filter(name='Test Folder').exists()
    assert created_folder.name == 'Test Folder'
    assert created_folder.type == Folder.CUSTOM
    assert created_folder.project == project


@pytest.mark.django_db
def test_folder_serializer_create_with_invalid_project_id():
    request = type('Request', (object,), {'data': {'project_id': 999}})
    context = {'request': request}
    serializer = FolderSerializer(context=context)

    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    with pytest.raises(ValidationError):
        serializer.create(folder_data)


@pytest.mark.django_db
def test_folder_serializer_create_without_project_id():
    request = type('Request', (object,), {'data': {}})
    context = {'request': request}
    serializer = FolderSerializer(context=context)

    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    created_folder = serializer.create(folder_data)

    assert Folder.objects.filter(name='Test Folder').exists()
    assert created_folder.name == 'Test Folder'
    assert created_folder.type == Folder.CUSTOM
    assert created_folder.project is None


@pytest.mark.django_db
def test_folder_serializer_update():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(name='Old Folder', type=Folder.CUSTOM, project=project)
    request = type('Request', (object,), {'data': {'project_id': project.id}})
    context = {'request': request}
    serializer = FolderSerializer(instance=folder, context=context)

    folder_data = {
        'name': 'Updated Folder',
        'type': Folder.FAVORITE,
    }
    updated_folder = serializer.update(folder, folder_data)

    assert updated_folder.name == 'Updated Folder'
    assert updated_folder.type == Folder.FAVORITE
    assert updated_folder.project == project


@pytest.mark.django_db
def test_folders_with_queries_serializer_create_with_valid_project_id():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    request = type('Request', (object,), {'data': {'project_id': project.id}})
    context = {'request': request}
    serializer = FoldersWithQueriesSerializer(context=context)

    folder_data = {
        'name': 'Test Folder',
        'type': Folder.FAVORITE,
    }
    created_folder = serializer.create(folder_data)

    assert Folder.objects.filter(name='Test Folder').exists()
    assert created_folder.name == 'Test Folder'
    assert created_folder.type == Folder.FAVORITE
    assert created_folder.project == project


@pytest.mark.django_db
def test_folders_with_queries_serializer_create_with_invalid_project_id():
    request = type('Request', (object,), {'data': {'project_id': 999}})
    context = {'request': request}
    serializer = FoldersWithQueriesSerializer(context=context)

    folder_data = {
        'name': 'Test Folder',
        'type': Folder.FAVORITE,
    }
    with pytest.raises(ValidationError):
        serializer.create(folder_data)


@pytest.mark.django_db
def test_folders_with_queries_serializer_create_without_project_id():
    request = type('Request', (object,), {'data': {}})
    context = {'request': request}
    serializer = FoldersWithQueriesSerializer(context=context)

    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    created_folder = serializer.create(folder_data)

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

    serialized_data = serializer.get_queries(folder)

    assert len(serialized_data) == 1
    assert serialized_data[0]['name'] == 'Test Query'


@pytest.mark.django_db
def test_folders_with_queries_serializer_get_queries_favorite():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Favorite Folder', type=Folder.FAVORITE)
    FavoriteQuery.objects.create(project=project, folder=folder, name='Test Query', cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes')
    serializer = FoldersWithQueriesSerializer()

    serialized_data = serializer.get_queries(folder)

    assert len(serialized_data) == 1
    assert serialized_data[0]['name'] == 'Test Query'


@pytest.mark.django_db
def test_folders_with_queries_serializer_get_queries_empty():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Empty Folder', type=Folder.CUSTOM)
    serializer = FoldersWithQueriesSerializer()

    serialized_data = serializer.get_queries(folder)

    assert len(serialized_data) == 0

@pytest.mark.django_db
def test_folder_serializer_create_with_project_does_not_exist():
    request = type('Request', (object,), {'data': {'project_id': 999}})
    context = {'request': request}
    serializer = FolderSerializer(context=context)

    folder_data = {
        'name': 'Test Folder',
        'type': Folder.CUSTOM,
    }
    try:
        serializer.create(folder_data)
    except ValidationError as e:
        assert str(e) == "['Project with id 999 does not exist.']"
