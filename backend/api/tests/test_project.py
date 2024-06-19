import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from ..models import Project
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

# To make this pass you should put a file in the test folder and update the file name in the test


@pytest.mark.django_db
def test_create_project(api_client, project_data):
    url = reverse('projects-list')
    file_path = os.path.join(os.path.dirname(__file__), 'perfetto.graphml')
    with open(file_path, 'rb') as file:
        project_data['file'] = SimpleUploadedFile(file.name, file.read())
    response = api_client.post(url, project_data, format='multipart')
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['name'] == project_data['name']
    assert response.data['file_name'] == project_data['file_name']


# @pytest.fixture
# def project_file():
#     file_mock = MagicMock()
#     file_mock.name = 'test_file.txt'
#     file_mock.size = 100
#     file_mock.read.return_value = b"file_content"
#     return file_mock

# # Test Cases


# @pytest.mark.django_db
# @patch('api.views.project_viewset.modify_file')
# def test_create_project_with_file(mock_modify_file, api_client, project_data, project_file):
#     url = reverse('projects-list')
#     project_data['file'] = project_file

#     response = api_client.post(url, project_data, format='multipart')

#     assert response.status_code == 201
#     assert Project.objects.filter(name=project_data['name']).exists()
#     project = Project.objects.get(name=project_data['name'])
#     mock_modify_file.assert_called_once_with(project.id, project_file, False)
#     assert Folder.objects.filter(
#         project=project, name='Project Custom Queries').exists()
#     assert Folder.objects.filter(
#         project=project, name='Project Favorite Queries').exists()


# @pytest.mark.django_db
# def test_create_project_without_file(api_client, project_data):
#     url = reverse('projects-list')

#     response = api_client.post(url, project_data, format='multipart')

#     assert response.status_code == 400
#     assert 'error' in response.data
#     assert not Project.objects.filter(name=project_data['name']).exists()


# @pytest.mark.django_db
# @patch('api.views.project_viewset.modify_file')
# def test_partial_update_project(mock_modify_file, api_client, project_data, project_file):
#     # Create a project first
#     project = Project.objects.create(**project_data)
#     url = reverse('projects-detail', args=[project.id])

#     updated_data = {"name": "Updated Project", "file": project_file}
#     response = api_client.patch(url, updated_data, format='multipart')

#     assert response.status_code == 200
#     project.refresh_from_db()
#     assert project.name == "Updated Project"
#     mock_modify_file.assert_called_once_with(
#         project.id, project_file, reupload=True)
