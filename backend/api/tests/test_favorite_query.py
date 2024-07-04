import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from ..models import Project, Folder, FavoriteQuery


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def project(db):
    project = Project(
        name="Test Project",
        file_name="test_file"
    )
    project.save()  # saves the project to the database but does not use the overridden create method
    return project


@pytest.fixture
def favorite_folder(project):
    return Folder.objects.create(project=project, name="Favorites", type=Folder.FAVORITE)


@pytest.fixture
def second_favorite_folder(project):
    return Folder.objects.create(project=project, name="second_favorite", type=Folder.CUSTOM)


@pytest.fixture
def favorite_query(project, favorite_folder):
    return FavoriteQuery.objects.create(
        project=project,
        folder=favorite_folder,
        name="Test Query",
        cypher_query="MATCH (n) RETURN n",
        natural_language_query="Find all nodes"
    )


@pytest.mark.django_db
def test_create_new_query(api_client, project, favorite_folder):
    url = reverse('favoritequery-list')
    data = {
        "project": project.id,
        "folder": favorite_folder.id,
        "name": "New Query",
        "cypher_query": "MATCH (n) RETURN n",
        "natural_language_query": "Find all nodes"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 201
    assert FavoriteQuery.objects.filter(name="New Query").exists()


@pytest.mark.django_db
def test_create_query_with_same_name(api_client, favorite_query, project, favorite_folder):
    url = reverse('favoritequery-list')
    data = {
        "project": project.id,
        "folder": favorite_folder.id,
        "name": "Test Query",
        "cypher_query": "MATCH (n) RETURN n",
        "natural_language_query": "Find all nodes"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400

@pytest.mark.django_db
def test_by_folder_method_non_integer_folder_id(api_client):
    url = reverse('favoritequery-by-folder') + '?folder_id=abc'
    response = api_client.get(url, format='json')
    assert response.status_code == 400
    assert "Error: Folder ID must be an integer." in str(response.data)

@pytest.mark.django_db
def test_create_query_with_missing_fields(api_client, project, favorite_folder):
    url = reverse('favoritequery-list')
    data = {
        "project": project.id,
        "folder": favorite_folder.id,
        "name": "Incomplete Query"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400


@pytest.mark.django_db
def test_retrieve_specific_query(api_client, favorite_query):
    url = reverse('favoritequery-detail', args=[favorite_query.id])
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    assert response.data['id'] == favorite_query.id


@pytest.mark.django_db
def test_retrieve_all_queries(api_client, favorite_query):
    url = reverse('favoritequery-list')
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    assert len(response.data) == 1


@pytest.mark.django_db
def test_by_folder_method(api_client, project, favorite_folder, second_favorite_folder, favorite_query):
    # Add more queries to the favorite_folder
    for i in range(2):
        FavoriteQuery.objects.create(
            project=project,
            folder=favorite_folder,
            name=f"Additional Query {i}",
            cypher_query="MATCH (n) RETURN n",
            natural_language_query="Find all nodes"
        )

    # Add queries to the second_favorite_folder
    for i in range(2):
        FavoriteQuery.objects.create(
            project=project,
            folder=second_favorite_folder,
            name=f"Other Query {i}",
            cypher_query="MATCH (n) RETURN n",
            natural_language_query="Find all nodes"
        )

    # Test retrieving queries by folder
    url = reverse('favoritequery-by-folder') + \
        f'?folder_id={favorite_folder.id}'
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    # Only queries in favorite_folder should be returned
    assert len(response.data) == 3
    query_ids = [query['id'] for query in response.data]
    assert favorite_query.id in query_ids
    assert all(q['folder'] == favorite_folder.id for q in response.data)

    # Test retrieving queries by second_favorite_folder
    url = reverse('favoritequery-by-folder') + \
        f'?folder_id={second_favorite_folder.id}'
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    # Only queries in second_favorite_folder should be returned
    assert len(response.data) == 2
    assert all(q['folder'] == second_favorite_folder.id for q in response.data)


@pytest.mark.django_db
def test_by_folder_method_invalid_folder(api_client):
    url = reverse('favoritequery-by-folder') + '?folder_id=999'
    response = api_client.get(url, format='json')
    assert response.status_code == 400
