import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from ..models import Folder, Project
from ..serializers.custom_query_serializer import CustomQuerySerializer

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def project():
    return Project.objects.create(name="Test Project")

@pytest.fixture
def folder(project):
    return Folder.objects.create(project=project, name="Test Folder", type=Folder.CUSTOM)

@pytest.mark.django_db
def test_create_new_folder(api_client, project):
    url = reverse('folders-list')
    data = {
        "project": project.id,
        "name": "New Folder",
        "type": Folder.CUSTOM
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 201
    assert Folder.objects.filter(name="New Folder").exists()

@pytest.mark.django_db
def test_retrieve_specific_folder(api_client, folder):
    url = reverse('folders-detail', args=[folder.id])
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    assert response.data['id'] == folder.id

@pytest.mark.django_db
def test_by_project_method(api_client, project, folder):
    url = reverse('folders-by-project') + f'?project={project.id}&type={Folder.CUSTOM}'
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]['id'] == folder.id

@pytest.mark.django_db
def test_folders_with_queries_method(api_client, project, folder):
    url = reverse('folders-folders-with-queries') + f'?project={project.id}&type={Folder.CUSTOM}'
    response = api_client.get(url, format='json')
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]['id'] == folder.id