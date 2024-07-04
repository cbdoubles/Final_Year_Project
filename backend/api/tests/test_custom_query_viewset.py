import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from ..models import Project, Folder, CustomQuery

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def project():
    return Project.objects.create(name="Test Project")

@pytest.fixture
def custom_folder(project):
    return Folder.objects.create(project=project, name="Custom", type=Folder.CUSTOM)

@pytest.fixture
def custom_query(project, custom_folder):
    return CustomQuery.objects.create(
        project=project,
        folder=custom_folder,
        name="Test Query",
        cypher_query="MATCH (n) RETURN n",
        natural_language_query="Find all nodes"
    )

@pytest.mark.django_db
def test_create_new_custom_query(api_client, project, custom_folder):
    url = reverse('customquery-list')
    data = {
        "project": project.id,
        "folder": custom_folder.id,
        "name": "New Query",
        "cypher_query": "MATCH (n) RETURN n",
        "natural_language_query": "Find all nodes"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 201
    assert CustomQuery.objects.filter(name="New Query").exists()

@pytest.mark.django_db
def test_retrieve_specific_custom_query(api_client, custom_query):
    url = reverse('customquery-detail', args=[custom_query.id])
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    assert response.data['id'] == custom_query.id

@pytest.mark.django_db
def test_by_folder_method(api_client, project, custom_folder, custom_query):
    # Add more queries to the custom_folder
    for i in range(2):
        CustomQuery.objects.create(
            project=project,
            folder=custom_folder,
            name=f"Additional Query {i}",
            cypher_query="MATCH (n) RETURN n",
            natural_language_query="Find all nodes"
        )

    # Test retrieving queries by folder
    url = reverse('customquery-by-folder') + f'?folder_id={custom_folder.id}'
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    # Only queries in custom_folder should be returned
    assert len(response.data) == 3
    query_ids = [query['id'] for query in response.data]
    assert custom_query.id in query_ids
    assert all(q['folder'] == custom_folder.id for q in response.data)

@pytest.mark.django_db
def test_by_folder_method_non_integer_folder_id(api_client):
    url = reverse('customquery-by-folder') + '?folder_id=abc'
    response = api_client.get(url, format='json')
    assert response.status_code == 400
    assert "Error: Folder ID must be an integer." in str(response.data)

@pytest.mark.django_db
def test_by_folder_method_invalid_folder(api_client):
    url = reverse('customquery-by-folder') + '?folder_id=999'
    response = api_client.get(url, format='json')
    assert response.status_code == 400
    assert "Error: A Folder with this ID does not exist." in str(response.data)