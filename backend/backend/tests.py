from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Project, Folder, CustomQuery
from django.urls import reverse
from backend.api.Serializers.serializers import CustomQuerySerializer


class CustomQueryViewSetTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.project = Project.objects.create(name="Test Project New IMp")
        self.folder = Folder.objects.create(
            project=self.project, name="Test Folder", type=Folder.CUSTOM)
        self.valid_payload = {
            'project': self.project.id,
            'folder': self.folder.id,
            'name': 'Test Query',
            'cypher_query': 'MATCH (n) RETURN n',
            'natural_language_query': 'Return all nodes'
        }
        self.invalid_payload = {
            'project': self.project.id,
            'folder': self.folder.id,
            'name': '',
            'cypher_query': '',
            'natural_language_query': ''
        }

    def test_create_valid_custom_query(self):
        response = self.client.post(
            reverse('customquery-list'),
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomQuery.objects.count(), 1)
        self.assertEqual(CustomQuery.objects.get().name, 'Test Query')

    def test_create_invalid_custom_query(self):
        response = self.client.post(
            reverse('customquery-list'),
            data=self.invalid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_custom_queries(self):
        CustomQuery.objects.create(
            project=self.project,
            folder=self.folder,
            name='Test Query',
            cypher_query='MATCH (n) RETURN n',
            natural_language_query='Return all nodes'
        )
        # CustomQuery.objects.create(**self.valid_payload)
        response = self.client.get(reverse('customquery-list'))
        queries = CustomQuery.objects.all()
        serializer = CustomQuerySerializer(queries, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_single_custom_query(self):
        query = CustomQuery.objects.create(
            project=self.project,
            folder=self.folder,
            name='Test Query',
            cypher_query='MATCH (n) RETURN n',
            natural_language_query='Return all nodes'
        )
        # query = CustomQuery.objects.create(**self.valid_payload)
        response = self.client.get(
            reverse('customquery-detail', kwargs={'pk': query.pk}))
        serializer = CustomQuerySerializer(query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_update_custom_query(self):
        query = CustomQuery.objects.create(
            project=self.project,
            folder=self.folder,
            name='Test Query',
            cypher_query='MATCH (n) RETURN n',
            natural_language_query='Return all nodes'
        )
        updated_payload = {
            'project': self.project.id,
            'folder': self.folder.id,
            'name': 'Updated Query',
            'cypher_query': 'MATCH (n) RETURN n',
            'natural_language_query': 'Return all nodes'
        }
        response = self.client.put(
            reverse('customquery-detail', kwargs={'pk': query.pk}),
            data=updated_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        query.refresh_from_db()
        self.assertEqual(query.name, 'Updated Query')

    def test_delete_custom_query(self):
        query = CustomQuery.objects.create(
            project=self.project,
            folder=self.folder,
            name='Test Query',
            cypher_query='MATCH (n) RETURN n',
            natural_language_query='Return all nodes'
        )
        # query = CustomQuery.objects.create(**self.valid_payload)
        response = self.client.delete(
            reverse('customquery-detail', kwargs={'pk': query.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CustomQuery.objects.count(), 0)
