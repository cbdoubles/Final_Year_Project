import pytest
from django.db.utils import IntegrityError
from ..models import Project, Folder, CustomQuery, FavoriteQuery, DefaultQuery

@pytest.mark.django_db
def test_project_creation():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    assert project.name == 'Test Project'
    assert project.file_name == 'test_file.txt'
    assert str(project) == f'Project: {project.name}, ID: {project.id}, File Name: {project.file_name}'

@pytest.mark.django_db
def test_folder_creation():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.CUSTOM)
    assert folder.name == 'Test Folder'
    assert folder.type == Folder.CUSTOM
    assert folder.project == project
    assert str(folder) == f'Folder: {folder.name} for {folder.type} queries (Project: {folder.project.name})'

@pytest.mark.django_db
def test_custom_query_creation():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.CUSTOM)
    custom_query = CustomQuery.objects.create(
        project=project, folder=folder, name='Test Custom Query',
        cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
    )
    assert custom_query.name == 'Test Custom Query'
    assert custom_query.cypher_query == 'MATCH (n) RETURN n'
    assert custom_query.natural_language_query == 'Find all nodes'
    assert custom_query.project == project
    assert custom_query.folder == folder
    assert str(custom_query) == f'Custom Query: {custom_query.name} (Project: {custom_query.project.name})'

@pytest.mark.django_db
def test_favorite_query_creation():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.FAVORITE)
    favorite_query = FavoriteQuery.objects.create(
        project=project, folder=folder, name='Test Favorite Query',
        cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
    )
    assert favorite_query.name == 'Test Favorite Query'
    assert favorite_query.cypher_query == 'MATCH (n) RETURN n'
    assert favorite_query.natural_language_query == 'Find all nodes'
    assert favorite_query.project == project
    assert favorite_query.folder == folder
    assert str(favorite_query) == f'Favorite Query: {favorite_query.name} (Project: {favorite_query.project.name})'

@pytest.mark.django_db
def test_default_query_creation():
    default_query = DefaultQuery.objects.create(
        name='Test Default Query', cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
    )
    assert default_query.name == 'Test Default Query'
    assert default_query.cypher_query == 'MATCH (n) RETURN n'
    assert default_query.natural_language_query == 'Find all nodes'
    assert str(default_query) == f'Default Query: {default_query.name}'

@pytest.mark.django_db
def test_folder_unique_constraint():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    Folder.objects.create(project=project, name='Test Folder', type=Folder.CUSTOM)
    with pytest.raises(IntegrityError):
        Folder.objects.create(project=project, name='Test Folder', type=Folder.CUSTOM)

@pytest.mark.django_db
def test_custom_query_unique_constraint():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.CUSTOM)
    CustomQuery.objects.create(
        project=project, folder=folder, name='Test Custom Query',
        cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
    )
    with pytest.raises(IntegrityError):
        CustomQuery.objects.create(
            project=project, folder=folder, name='Test Custom Query',
            cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
        )

@pytest.mark.django_db
def test_favorite_query_unique_constraint():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    folder = Folder.objects.create(project=project, name='Test Folder', type=Folder.FAVORITE)
    FavoriteQuery.objects.create(
        project=project, folder=folder, name='Test Favorite Query',
        cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
    )
    with pytest.raises(IntegrityError):
        FavoriteQuery.objects.create(
            project=project, folder=folder, name='Test Favorite Query',
            cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
        )

@pytest.mark.django_db
def test_create_multiple_folders_different_types():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    Folder.objects.create(project=project, name='Test Folder', type=Folder.CUSTOM)
    Folder.objects.create(project=project, name='Test Folder', type=Folder.FAVORITE)
    assert Folder.objects.filter(project=project, name='Test Folder').count() == 2

@pytest.mark.django_db
def test_create_queries_in_different_folders():
    project = Project.objects.create(name='Test Project', file_name='test_file.txt')
    custom_folder = Folder.objects.create(project=project, name='Custom Folder', type=Folder.CUSTOM)
    favorite_folder = Folder.objects.create(project=project, name='Favorite Folder', type=Folder.FAVORITE)
    CustomQuery.objects.create(
        project=project, folder=custom_folder, name='Test Query',
        cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
    )
    FavoriteQuery.objects.create(
        project=project, folder=favorite_folder, name='Test Query',
        cypher_query='MATCH (n) RETURN n', natural_language_query='Find all nodes'
    )
    assert CustomQuery.objects.filter(project=project, name='Test Query').count() == 1
    assert FavoriteQuery.objects.filter(project=project, name='Test Query').count() == 1
