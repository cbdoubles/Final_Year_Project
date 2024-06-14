import os
import django
from django.conf import settings

# api/test_views.py

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from api.models import FavoriteQuery, Folder

class FavoriteQueryViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.folder = Folder.objects.create(name="Test Folder")
        self.favorite_query = FavoriteQuery.objects.create(
            project="Test Project",
            folder=self.folder,
            name="Test Query",
            cypher_query="MATCH (n) RETURN n",
            natural_language_query="Return all nodes"
        )

    def test_get_favorite_queries_by_folder(self):
        response = self.client.get(
            reverse('favoritequery-by-folder'),
            {'folder_id': self.folder.id},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.favorite_query.name)

    def test_get_favorite_queries_by_folder_invalid_folder(self):
        response = self.client.get(
            reverse('favoritequery-by-folder'),
            {'folder_id': 999},  # assuming this folder ID does not exist
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_favorite_queries_by_folder_invalid_folder_id(self):
        response = self.client.get(
            reverse('favoritequery-by-folder'),
            {'folder_id': 'invalid_id'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)




##############################################################################################################
##############################################################################################################


# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# django.setup()

# import pytest
# from rest_framework.test import APIClient
# from rest_framework import status
# from django.urls import reverse
# from django.core.files.uploadedfile import SimpleUploadedFile
# from .models import Project, FavoriteQuery, CustomQuery, Folder


# @pytest.fixture
# def api_client():
#     return APIClient()

# @pytest.fixture
# def folder(db):  # Ensure the fixture uses the database
#     return Folder.objects.create(name="Test Folder")

# @pytest.fixture
# def favorite_query(db, folder):  # Ensure the fixture uses the database
#     return FavoriteQuery.objects.create(
#         project="Test Project",
#         folder=folder,
#         name="Test Query",
#         cypher_query="MATCH (n) RETURN n",
#         natural_language_query="Return all nodes"
#     )

# @pytest.fixture
# def valid_payload(folder):
#     return {
#         'project': 'New Project',
#         'folder': folder.id,
#         'name': 'New Query',
#         'cypher_query': 'MATCH (m) RETURN m',
#         'natural_language_query': 'Return all matches'
#     }

# @pytest.fixture
# def invalid_payload(folder):
#     return {
#         'project': '',
#         'folder': folder.id,
#         'name': '',
#         'cypher_query': 'MATCH (m) RETURN m',
#         'natural_language_query': 'Return all matches'
#     }

# @pytest.mark.django_db
# def test_create_valid_favorite_query(api_client, valid_payload):
#     response = api_client.post(
#         reverse('favoritequery-list'),
#         data=valid_payload,
#         format='json'
#     )
#     assert response.status_code == status.HTTP_201_CREATED

# @pytest.mark.django_db
# def test_create_invalid_favorite_query(api_client, invalid_payload):
#     response = api_client.post(
#         reverse('favoritequery-list'),
#         data=invalid_payload,
#         format='json'
#     )
#     assert response.status_code == status.HTTP_400_BAD_REQUEST

# @pytest.mark.django_db
# def test_get_all_favorite_queries(api_client, favorite_query):
#     response = api_client.get(reverse('favoritequery-list'))
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1

# @pytest.mark.django_db
# def test_get_single_favorite_query(api_client, favorite_query):
#     response = api_client.get(
#         reverse('favoritequery-detail', kwargs={'pk': favorite_query.pk})
#     )
#     assert response.status_code == status.HTTP_200_OK
#     assert favorite_query.name in response.content.decode()

# @pytest.mark.django_db
# def test_update_favorite_query(api_client, favorite_query, valid_payload):
#     response = api_client.put(
#         reverse('favoritequery-detail', kwargs={'pk': favorite_query.pk}),
#         data=valid_payload,
#         format='json'
#     )
#     assert response.status_code == status.HTTP_200_OK

# @pytest.mark.django_db
# def test_delete_favorite_query(api_client, favorite_query):
#     response = api_client.delete(
#         reverse('favoritequery-detail', kwargs={'pk': favorite_query.pk})
#     )
#     assert response.status_code == status.HTTP_204_NO_CONTENT

# @pytest.mark.django_db
# def test_get_favorite_queries_by_folder(api_client, folder, favorite_query):
#     response = api_client.get(
#         reverse('favoritequery-by-folder'),
#         {'folder_id': folder.id},
#         format='json'
#     )
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1

# @pytest.mark.django_db
# def test_get_favorite_queries_by_folder_invalid_folder(api_client):
#     response = api_client.get(
#         reverse('favoritequery-by-folder'),
#         {'folder_id': 999},  # assuming this folder ID does not exist
#         format='json'
#     )
#     assert response.status_code == status.HTTP_400_BAD_REQUEST

# @pytest.mark.django_db
# def test_get_favorite_queries_by_folder_invalid_folder_id(api_client):
#     response = api_client.get(
#         reverse('favoritequery-by-folder'),
#         {'folder_id': 'invalid_id'},
#         format='json'
#     )
#     assert response.status_code == status.HTTP_400_BAD_REQUEST

##############################################################################################################
##############################################################################################################


# @pytest.fixture
# def api_client():
#     return APIClient()

# @pytest.fixture
# def create_project():
#     return Project.objects.create(name="Test Project", file_name="test_file")

# @pytest.fixture
# def create_folder(create_project):
#     return Folder.objects.create(name="Test Folder", type="Custom", project=create_project)

# @pytest.fixture
# def create_favorite_folder(create_project):
#     return Folder.objects.create(name="Favorite Folder", type="Favorite", project=create_project)

# @pytest.fixture
# def create_custom_query(create_folder):
#     return CustomQuery.objects.create(folder=create_folder, name="Test Query")

# @pytest.fixture
# def create_favorite_query(create_favorite_folder):
#     return FavoriteQuery.objects.create(folder=create_favorite_folder, name="Favorite Query")

# # Project ViewSet Tests
# @pytest.mark.django_db
# def test_create_project(api_client):
#     url = reverse('projects-list')
#     data = {
#         'name': 'Test Project',
#         'file_name': 'test_file',
#         'file': SimpleUploadedFile("file.json", b"file_content")
#     }
#     response = api_client.post(url, data, format='multipart')
#     assert response.status_code == status.HTTP_201_CREATED
#     assert Project.objects.count() == 1
#     assert Project.objects.get().name == 'Test Project'

# @pytest.mark.django_db
# def test_retrieve_project(api_client, create_project):
#     url = reverse('projects-detail', args=[create_project.id])
#     response = api_client.get(url)
#     assert response.status_code == status.HTTP_200_OK
#     assert response.data['name'] == create_project.name

# @pytest.mark.django_db
# def test_update_project(api_client, create_project):
#     url = reverse('projects-detail', args=[create_project.id])
#     data = {'name': 'Updated Project Name'}
#     response = api_client.patch(url, data, format='json')
#     assert response.status_code == status.HTTP_200_OK
#     create_project.refresh_from_db()
#     assert create_project.name == 'Updated Project Name'

# @pytest.mark.django_db
# def test_delete_project(api_client, create_project):
#     url = reverse('projects-detail', args=[create_project.id])
#     response = api_client.delete(url)
#     assert response.status_code == status.HTTP_204_NO_CONTENT
#     assert Project.objects.count() == 0

# # FavoriteQuery ViewSet Tests
# @pytest.mark.django_db
# def test_create_favorite_query(api_client, create_favorite_folder):
#     url = reverse('favoritequery-list')
#     data = {'folder': create_favorite_folder.id, 'name': 'Favorite Query'}
#     response = api_client.post(url, data, format='json')
#     assert response.status_code == status.HTTP_201_CREATED
#     assert FavoriteQuery.objects.count() == 1
#     assert FavoriteQuery.objects.get().name == 'Favorite Query'

# @pytest.mark.django_db
# def test_list_favorite_queries(api_client, create_favorite_query):
#     url = reverse('favoritequery-list')
#     response = api_client.get(url)
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1
#     assert response.data[0]['name'] == create_favorite_query.name

# @pytest.mark.django_db
# def test_list_favorite_queries_by_folder(api_client, create_favorite_folder, create_favorite_query):
#     url = reverse('favoritequery-by-folder')
#     response = api_client.get(url, {'folder_id': create_favorite_folder.id})
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1
#     assert response.data[0]['name'] == create_favorite_query.name

# # CustomQuery ViewSet Tests
# @pytest.mark.django_db
# def test_create_custom_query(api_client, create_folder):
#     url = reverse('customquery-list')
#     data = {'folder': create_folder.id, 'name': 'Custom Query'}
#     response = api_client.post(url, data, format='json')
#     assert response.status_code == status.HTTP_201_CREATED
#     assert CustomQuery.objects.count() == 1
#     assert CustomQuery.objects.get().name == 'Custom Query'

# @pytest.mark.django_db
# def test_list_custom_queries(api_client, create_custom_query):
#     url = reverse('customquery-list')
#     response = api_client.get(url)
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1
#     assert response.data[0]['name'] == create_custom_query.name

# @pytest.mark.django_db
# def test_list_custom_queries_by_folder(api_client, create_folder, create_custom_query):
#     url = reverse('customquery-by-folder')
#     response = api_client.get(url, {'folder_id': create_folder.id})
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1
#     assert response.data[0]['name'] == create_custom_query.name

# # Folder ViewSet Tests
# @pytest.mark.django_db
# def test_create_folder(api_client, create_project):
#     url = reverse('folders-list')
#     data = {'name': 'Test Folder', 'type': 'Custom', 'project': create_project.id}
#     response = api_client.post(url, data, format='json')
#     assert response.status_code == status.HTTP_201_CREATED
#     assert Folder.objects.count() == 1
#     assert Folder.objects.get().name == 'Test Folder'

# @pytest.mark.django_db
# def test_list_folders(api_client, create_folder):
#     url = reverse('folders-list')
#     response = api_client.get(url)
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1
#     assert response.data[0]['name'] == create_folder.name

# @pytest.mark.django_db
# def test_list_folders_by_project(api_client, create_folder, create_project):
#     url = reverse('folders-by-project')
#     response = api_client.get(url, {'project': create_project.id, 'type': create_folder.type})
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1
#     assert response.data[0]['name'] == create_folder.name

# @pytest.mark.django_db
# def test_list_folders_with_queries(api_client, create_folder, create_custom_query, create_project):
#     url = reverse('folders-with-queries')
#     response = api_client.get(url, {'project': create_project.id, 'type': create_folder.type})
#     assert response.status_code == status.HTTP_200_OK
#     assert len(response.data) == 1
#     assert response.data[0]['name'] == create_folder.name
#     assert len(response.data[0]['queries']) == 1
#     assert response.data[0]['queries'][0]['name'] == create_custom_query.name
