from backend import settings
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from ..models import Project, Folder
from django.core.files.uploadedfile import SimpleUploadedFile
import os


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def project_data():
    return {
        'name': 'Test Project',
        'file_name': 'Test File'
    }


@pytest.fixture
def project():
    project = Project(name='Test Project', file_name='Test File')
    project.save()
    return project


@pytest.fixture
def projects():
    projects = []
    for i in range(3):
        project = Project(name=f'Test Project {i}', file_name=f'Test File {i}')
        project.save()
        projects.append(project)
    return projects


@pytest.mark.django_db
def test_create_project(api_client, project_data):
    url = reverse('projects-list')
    # Create a mock file
    mock_file = SimpleUploadedFile('mock_file.graphml', b'This is a test file content', content_type='application/xml')
    project_data['file'] = mock_file
    
    response = api_client.post(url, project_data, format='multipart')
    
    assert response.status_code == status.HTTP_201_CREATED, f"Expected status code 201 but got {response.status_code}. Response data: {response.data}"
    assert response.data['name'] == project_data['name']
    assert response.data['file_name'] == project_data['file_name']

    # Fetch the created project
    project = Project.objects.get(id=response.data['id'])

    # Check if the default folders are created
    default_folders = Folder.objects.filter(project=project)
    assert default_folders.count() == 2
    assert default_folders.filter(name='Project Custom Queries', type='Custom').exists()
    assert default_folders.filter(name='Project Favorite Queries', type='Favorite').exists()

@pytest.mark.django_db
def test_create_project_without_file(api_client, project_data):
    url = reverse('projects-list')

    response = api_client.post(url, project_data, format='multipart')

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'error' in response.data
    assert not Project.objects.filter(name=project_data['name']).exists()


@pytest.mark.django_db
def test_partial_update_project_without_file(api_client, project):
    url = reverse('projects-detail', args=[project.id])
    update_data = {
        'name': 'Updated Project',
        'file_name': 'Updated File'
    }
    response = api_client.patch(url, update_data, format='multipart')

    assert response.status_code == status.HTTP_200_OK
    project.refresh_from_db()
    assert project.name == 'Updated Project'
    assert project.file_name == 'Updated File'

@pytest.mark.django_db
def test_create_project_without_file(api_client, project_data):
    url = reverse('projects-list')
    # Remove the file from project_data to simulate the missing file scenario
    if 'file' in project_data:
        del project_data['file']
    response = api_client.post(url, project_data, format='multipart')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['error'] == 'File not provided'

@pytest.mark.django_db
def test_create_project_with_invalid_data(api_client):
    url = reverse('projects-list')
    invalid_data = {
        'name': '',  # Invalid name
        'file_name': 'Test File'
    }
    response = api_client.post(url, invalid_data, format='multipart')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'error' in response.data

from unittest.mock import patch

@pytest.mark.django_db
def test_create_project_unexpected_error(api_client, project_data):
    url = reverse('projects-list')
    # Create a mock file
    mock_file = SimpleUploadedFile('mock_file.graphml', b'This is a test file content', content_type='application/xml')
    project_data['file'] = mock_file

    with patch('api.models.Project.save', side_effect=Exception('Unexpected error')):
        response = api_client.post(url, project_data, format='multipart')
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.data['error'] == 'An unexpected error occurred: Unexpected error'


@pytest.mark.django_db
def test_partial_update_project_without_file_error(api_client, project):
    url = reverse('projects-detail', args=[project.id])
    update_data = {
        'name': 'Updated Project',
        'file_name': 'Updated File'
    }
    response = api_client.patch(url, update_data, format='multipart')
    assert response.status_code == status.HTTP_200_OK
    project.refresh_from_db()
    assert project.name == 'Updated Project'
    assert project.file_name == 'Updated File'


@pytest.mark.django_db
def test_partial_update_project_with_invalid_data(api_client, project):
    url = reverse('projects-detail', args=[project.id])
    invalid_data = {
        'name': '',  # Invalid name
        'file_name': 'Updated File'
    }
    response = api_client.patch(url, invalid_data, format='multipart')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'error' in response.data


from unittest.mock import patch

@pytest.mark.django_db
def test_partial_update_project_unexpected_error(api_client, project):
    url = reverse('projects-detail', args=[project.id])
    update_data = {
        'name': 'Updated Project',
        'file_name': 'Updated File'
    }

    with patch('api.models.Project.save', side_effect=Exception('Unexpected error')):
        response = api_client.patch(url, update_data, format='multipart')
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.data['error'] == 'An unexpected error occurred: Unexpected error'




@pytest.mark.django_db
def test_partial_update_project_with_file(api_client, project):
    # Create a test file
    test_file = SimpleUploadedFile('test_file.txt', b'This is a test file.')

    # Send a PATCH request with the test file
    url = reverse('projects-detail', args=[project.id])
    response = api_client.patch(url, {'file': test_file}, format='multipart')
    assert response.status_code == status.HTTP_200_OK

    # Check that the response contains the filename of the uploaded file
    response_data = response.json()
    assert response_data['file_name'] == 'test_file.txt'

    # Check that the file has been saved to the correct location on the server
    file_path = os.path.join(
        settings.MEDIA_ROOT, 'projects', 'files', 'test_file.txt')
    assert os.path.exists(file_path)

    # Delete the test file
    os.remove(file_path)


@pytest.mark.django_db
def test_list_projects(api_client):
    url = reverse('projects-list')
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)
    assert len(response.json()) == 0


@pytest.mark.django_db
def test_list_projects_returns_all_projects(api_client, projects):
    url = reverse('projects-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)
    results = response.json()

    assert len(results) == len(projects)

    for project in projects:
        assert any(res['id'] == project.id for res in results)
        assert any(res['name'] == project.name for res in results)
        assert any(res['file_name'] == project.file_name for res in results)


@pytest.mark.django_db
def test_retrieve_project(api_client, project):
    url = reverse('projects-detail', args=[project.id])
    response = api_client.get(url)
    response_data = response.json()
    assert response.status_code == status.HTTP_200_OK
    assert response_data['id'] == project.id
    assert response_data['name'] == project.name
    assert response_data['file_name'] == project.file_name


@pytest.mark.django_db
def test_delete_project(api_client, project):
    url = reverse('projects-detail', args=[project.id])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Try to fetch the project again
    response = api_client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND
