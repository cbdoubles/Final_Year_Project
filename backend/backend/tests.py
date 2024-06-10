# import json
# from django.test import TestCase, Client, TransactionTestCase
# from django.urls import reverse
# from rest_framework import status
# from api.models import Project, CustomQuery
# from django.test import TestCase, Client, TransactionTestCase
# from django.urls import reverse
# from rest_framework import status
# from api.models import Project, CustomQuery

# # # class CypherQueryTestCase(TestCase):
# # #     def setUP(self):
# # #         self.client = Client()

# # #     def test_cypher_query(self):

# # #         url = '/cypher_query/' # url to cypher query view

# # #         # data to be sent

# # #         data = {
# # #             "cypher_query": "Match (n) RETURN n",
# # #             "natural_query": "Return all nodes",
# # #             "save": True
# # #         }
        
# # #         # send a post request to the view
# # #         response = self.client.post(url, data, content_type = "application/json")

# # #         # check the response status code is 200
# # #         self.assertEqual(response.status_code, 200)

# # #         # Check the response content 
# # #         response_data = response.json()

# # #         self.assertTrue(isinstance(response_data, list))

# # # class CustomQueryViewSetTestCase(TestCase):
# # #     def setUp(self):
# # #         self.client = Client()
# # #         self.url = reverse('customquery-list')  # This is for the list/create view of the viewset

# # #     def test_create_custom_query(self):
# # #         data = {
# # #             "name": "testing-making-query",
# # #             "cypher_query": "MATCH (n) RETURN n",
# # #             "natural_language_query": "Return all nodes",
# # #             "project_id": 39
# # #         }        
# # #         response = self.client.post(self.url, json.dumps(data), content_type='application/json')
# # #         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
# # #         self.assertIn('cypher_query', response.json())
# # #         self.assertIn('natural_query', response.json())

# # # class CustomQueryViewSetTestCase(TestCase):
# # #     def setUp(self):
# # #         self.client = Client()
# # #         self.url = reverse('customquery-list')  # This is for the list/create view of the viewset

# # #         # Create a project object
# # #         self.project = Project.objects.create(name="Test Project")

# # #     def test_create_custom_query(self):
# # #         data = {
# # #             "name": "testing-making-query",
# # #             "cypher_query": "MATCH (n) RETURN n",
# # #             "natural_language_query": "Return all nodes",
# # #             "project": self.project.id
# # #         }        
# # #         # response = self.client.post(self.url, data, content_type='application/json')
# # #         # if response.status_code != status.HTTP_201_CREATED:
# # #         #     print("Response content:", response.content)
# # #         # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
# # #         # self.assertIn('cypher_query', response.json())
# # #         # self.assertIn('natural_language_query', response.json())

# # #         # Verify the query was saved in the database
# # #         # saved_query = CustomQuery.objects.get(name="testing-making-query")
# # #         # self.assertIsNotNone(saved_query)


# # #         # Step 1: Save the query to the database
# # #         response = self.client.post(self.url, data, content_type='application/json')
# # #         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
# # #         self.assertIn('cypher_query', response.json())
# # #         self.assertIn('natural_language_query', response.json())

# # #         # Step 2: Retrieve the query from the database
# # #         saved_query = CustomQuery.objects.get(name="testing-making-query")
# # #         query_id = saved_query.id
# # #         response = self.client.get(reverse('customquery-detail', args=[query_id]), content_type='application/json')
        
# # #         # Step 3: Print the response
# # #         print("Query Response:", response.json())
        
# # #         # # Step 4: Delete the query from the database
# # #         # response = self.client.delete(reverse('customquery-detail', args=[query_id]), content_type='application/json')
# # #         # self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
# # #         # # Verify the query is deleted
# # #         # with self.assertRaises(CustomQuery.DoesNotExist):
# # #         #     CustomQuery.objects.get(name="testing-making-query")

# # # if __name__ == "__main__":
# # #     unittest.main()


# # class CustomQueryViewSetTestCase(TransactionTestCase):
# #     reset_sequences = True

# #     def setUp(self):
# #         self.client = Client()
# #         self.url = reverse('customquery-list')  # This is for the list/create view of the viewset

# #         # Create a project object
# #         self.project = Project.objects.create(name="Test Project")

# #     def test_create_retrieve_and_delete_custom_query(self):
# #         data = {
# #             "name": "testing-making-query",
# #             "cypher_query": "MATCH (n) RETURN n",
# #             "natural_language_query": "Return all nodes",
# #             "project": self.project.id
# #         }
        
# #         # Step 1: Save the query to the database
# #         response = self.client.post(self.url, data, content_type='application/json')
# #         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
# #         self.assertIn('cypher_query', response.json())
# #         self.assertIn('natural_language_query', response.json())

# #         # Step 2: Retrieve the query from the database
# #         saved_query = CustomQuery.objects.get(name="testing-making-query")
# #         query_id = saved_query.id
# #         response = self.client.get(reverse('customquery-detail', args=[query_id]), content_type='application/json')
        
# #         # Step 3: Print the response
# #         print("Query Response:", response.json())
        
# #         # # Step 4: Delete the query from the database
# #         # response = self.client.delete(reverse('customquery-detail', args=[query_id]), content_type='application/json')
# #         # self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
# #         # # Verify the query is deleted
# #         # with self.assertRaises(CustomQuery.DoesNotExist):
# #         #     CustomQuery.objects.get(name="testing-making-query")

# # if __name__ == "__main__":
# #     unittest.main()


# # from django.test import TestCase
# # from rest_framework.test import APIRequestFactory
# # from rest_framework.exceptions import ValidationError
# # from api.models import Project, CustomQuery
# # from api.services import CustomQueryService

# # class CustomQueryServiceTest(TestCase):
# #     def setUp(self):
# #         self.factory = APIRequestFactory()
# #         self.project = Project.objects.create(name="Test Project")
# #         self.existing_query = CustomQuery.objects.create(
# #             project=self.project,
# #             name="Existing Query",
# #             cypher_query="MATCH (n) RETURN n",
# #             natural_language_query="Return all nodes"
# #         )

# #     def test_create_query_success(self):
# #         data = {
# #             "name": "New Query",
# #             "cypher_query": "MATCH (n) RETURN n LIMIT 10",
# #             "natural_language_query": "Return 10 nodes",
# #             "project_id": self.project.id
# #         }
# #         request = self.factory.post('/fake-url/', data, format='json')
# #         query, errors = CustomQueryService.create_query(data, request)
        
# #         self.assertIsNotNone(query)
# #         self.assertIsNone(errors)
# #         self.assertEqual(query.name, data["name"])
# #         self.assertEqual(query.cypher_query, data["cypher_query"])
# #         self.assertEqual(query.natural_language_query, data["natural_language_query"])
# #         self.assertEqual(query.project.id, data["project_id"])

# #     def test_create_query_missing_project_id(self):
# #         data = {
# #             "name": "New Query",
# #             "cypher_query": "MATCH (n) RETURN n LIMIT 10",
# #             "natural_language_query": "Return 10 nodes",
# #         }
# #         request = self.factory.post('/fake-url/', data, format='json')
        
# #         with self.assertRaises(ValidationError) as context:
# #             CustomQueryService.create_query(data, request)
        
# #         self.assertEqual(context.exception.detail["project_id"], "This field is required.")

# #     def test_create_query_non_existent_project(self):
# #         data = {
# #             "name": "New Query",
# #             "cypher_query": "MATCH (n) RETURN n LIMIT 10",
# #             "natural_language_query": "Return 10 nodes",
# #             "project_id": 9999  # Non-existent project ID
# #         }
# #         request = self.factory.post('/fake-url/', data, format='json')
        
# #         with self.assertRaises(ValidationError) as context:
# #             CustomQueryService.create_query(data, request)
        
# #         self.assertEqual(context.exception.detail["project_id"], "Project with id 9999 does not exist.")

# #     def test_create_query_duplicate_name(self):
# #         data = {
# #             "name": "Existing Query",
# #             "cypher_query": "MATCH (n) RETURN n LIMIT 10",
# #             "natural_language_query": "Return 10 nodes",
# #             "project_id": self.project.id
# #         }
# #         request = self.factory.post('/fake-url/', data, format='json')
        
# #         with self.assertRaises(ValidationError) as context:
# #             CustomQueryService.create_query(data, request)
        
# #         self.assertEqual(context.exception.detail["name"], "A query with this name already exists in the project.")

# #     def test_create_query_missing_required_fields(self):
# #         data = {
# #             "name": "New Query",
# #             "project_id": self.project.id
# #         }
# #         request = self.factory.post('/fake-url/', data, format='json')
        
# #         with self.assertRaises(ValidationError) as context:
# #             CustomQueryService.create_query(data, request)
        
# #         self.assertIn("cypher_query", context.exception.detail)
# #         self.assertIn("natural_language_query", context.exception.detail)

# # if __name__ == "__main__":
# #     unittest.main()


# from django.test import TransactionTestCase
# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APIClient
# from api.models import Project, CustomQuery, Folder

# class CustomQueryTestCase(TransactionTestCase):
#     def setUp(self):
#         self.client = APIClient()
#         # self.project = Project.objects.create(name="Test Project")
#         # self.folder = Folder.objects.create(project=self.project, name="Test Folder", type=Folder.CUSTOM)
#         self.valid_payload = {
#             "name": "Test Query",
#             "cypher_query": "MATCH (n) RETURN n",
#             "natural_language_query": "Return all nodes",
#             "project": 1,
#         }
#         self.invalid_payload_no_project = {
#             "name": "Test Query",
#             "cypher_query": "MATCH (n) RETURN n",
#             "natural_language_query": "Return all nodes"
#         }
#         self.invalid_payload_duplicate_name = {
#             "name": "Test Query",
#             "cypher_query": "MATCH (n) RETURN n",
#             "natural_language_query": "Return all nodes",
#             "project": 1,
#         }

#     def test_create_valid_custom_query(self):
#         response = self.client.post(reverse('customquery-list'), data=self.valid_payload, format='json')
#         print(response.data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         # self.assertEqual(CustomQuery.objects.count(), 1)
#         self.assertEqual(CustomQuery.objects.get().name, 'Test Query')

#     # def test_create_custom_query_no_project(self):
#     #     response = self.client.post(reverse('customquery-list'), data=self.invalid_payload_no_project, format='json')
#     #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#     #     self.assertEqual(CustomQuery.objects.count(), 0)

#     # def test_create_custom_query_duplicate_name(self):
#     #     self.client.post(reverse('customquery-list'), data=self.valid_payload, format='json')
#     #     response = self.client.post(reverse('customquery-list'), data=self.invalid_payload_duplicate_name, format='json')
#     #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#     #     self.assertEqual(CustomQuery.objects.count(), 1)

# if __name__ == "__main__":
#     unittest.main()


# tests.py

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Project, Folder, CustomQuery
from django.urls import reverse
from api.serializers import CustomQuerySerializer

class CustomQueryViewSetTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.project = Project.objects.create(name="Test Project New IMp")
        self.folder = Folder.objects.create(project=self.project, name="Test Folder", type=Folder.CUSTOM)
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
        response = self.client.get(reverse('customquery-detail', kwargs={'pk': query.pk}))
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
        # query = CustomQuery.objects.create(**self.valid_payload)
        # updated_payload = {
        #     'project': self.project.id,
        #     'folder': self.folder.id,
        #     'name': 'Updated Query',
        #     'cypher_query': 'MATCH (n) RETURN n',
        #     'natural_language_query': 'Return all nodes'
        # }
        # response = self.client.put(
        #     reverse('customquery-detail', kwargs={'pk': query.pk}),
        #     data=updated_payload,
        #     format='json'
        # )
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # query.refresh_from_db()
        # self.assertEqual(query.name, 'Updated Query')

    def test_delete_custom_query(self):
        query = CustomQuery.objects.create(
            project=self.project,
            folder=self.folder,
            name='Test Query',
            cypher_query='MATCH (n) RETURN n',
            natural_language_query='Return all nodes'
        )
        # query = CustomQuery.objects.create(**self.valid_payload)
        response = self.client.delete(reverse('customquery-detail', kwargs={'pk': query.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CustomQuery.objects.count(), 0)
