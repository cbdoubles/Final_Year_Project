# import json
# from django.test import TestCase, Client
# from django.urls import reverse
# from rest_framework import status
# from api.models import CustomQuery, Project

# # class CypherQueryTestCase(TestCase):
# #     def setUP(self):
# #         self.client = Client()

# #     def test_cypher_query(self):

# #         url = '/cypher_query/' # url to cypher query view

# #         # data to be sent

# #         data = {
# #             "cypher_query": "Match (n) RETURN n",
# #             "natural_query": "Return all nodes",
# #             "save": True
# #         }
        
# #         # send a post request to the view
# #         response = self.client.post(url, data, content_type = "application/json")

# #         # check the response status code is 200
# #         self.assertEqual(response.status_code, 200)

# #         # Check the response content 
# #         response_data = response.json()

# #         self.assertTrue(isinstance(response_data, list))

# # class CustomQueryViewSetTestCase(TestCase):
# #     def setUp(self):
# #         self.client = Client()
# #         self.url = reverse('customquery-list')  # This is for the list/create view of the viewset

# #     def test_create_custom_query(self):
# #         data = {
# #             "name": "testing-making-query",
# #             "cypher_query": "MATCH (n) RETURN n",
# #             "natural_language_query": "Return all nodes",
# #             "project_id": 39
# #         }        
# #         response = self.client.post(self.url, json.dumps(data), content_type='application/json')
# #         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
# #         self.assertIn('cypher_query', response.json())
# #         self.assertIn('natural_query', response.json())

# class CustomQueryViewSetTestCase(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.url = reverse('customquery-list')  # This is for the list/create view of the viewset

#         # Create a project object
#         self.project = Project.objects.create(name="Test Project")

#     def test_create_custom_query(self):
#         data = {
#             "name": "testing-making-query",
#             "cypher_query": "MATCH (n) RETURN n",
#             "natural_language_query": "Return all nodes",
#             "project": self.project.id
#         }        
#         response = self.client.post(self.url, data, content_type='application/json')
#         if response.status_code != status.HTTP_201_CREATED:
#             print("Response content:", response.content)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertIn('cypher_query', response.json())
#         self.assertIn('natural_language_query', response.json())

# if __name__ == "__main__":
#     unittest.main()


from django.test import TestCase, Client, TransactionTestCase
from django.urls import reverse
from rest_framework import status
from api.models import Project, CustomQuery

# class CustomQueryViewSetTestCase(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.url = reverse('customquery-list')  # This is for the list/create view of the viewset

#         # Create a project object
#         self.project = Project.objects.create(name="Test Project")

#     def test_create_custom_query(self):
#         data = {
#             "name": "testing-making-query",
#             "cypher_query": "MATCH (n) RETURN n",
#             "natural_language_query": "Return all nodes",
#             "project": self.project.id
#         }        
#         # response = self.client.post(self.url, data, content_type='application/json')
#         # if response.status_code != status.HTTP_201_CREATED:
#         #     print("Response content:", response.content)
#         # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         # self.assertIn('cypher_query', response.json())
#         # self.assertIn('natural_language_query', response.json())

#         # Verify the query was saved in the database
#         # saved_query = CustomQuery.objects.get(name="testing-making-query")
#         # self.assertIsNotNone(saved_query)


#         # Step 1: Save the query to the database
#         response = self.client.post(self.url, data, content_type='application/json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertIn('cypher_query', response.json())
#         self.assertIn('natural_language_query', response.json())

#         # Step 2: Retrieve the query from the database
#         saved_query = CustomQuery.objects.get(name="testing-making-query")
#         query_id = saved_query.id
#         response = self.client.get(reverse('customquery-detail', args=[query_id]), content_type='application/json')
        
#         # Step 3: Print the response
#         print("Query Response:", response.json())
        
#         # # Step 4: Delete the query from the database
#         # response = self.client.delete(reverse('customquery-detail', args=[query_id]), content_type='application/json')
#         # self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
#         # # Verify the query is deleted
#         # with self.assertRaises(CustomQuery.DoesNotExist):
#         #     CustomQuery.objects.get(name="testing-making-query")

# if __name__ == "__main__":
#     unittest.main()


class CustomQueryViewSetTestCase(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        self.client = Client()
        self.url = reverse('customquery-list')  # This is for the list/create view of the viewset

        # Create a project object
        self.project = Project.objects.create(name="Test Project")

    def test_create_retrieve_and_delete_custom_query(self):
        data = {
            "name": "testing-making-query",
            "cypher_query": "MATCH (n) RETURN n",
            "natural_language_query": "Return all nodes",
            "project": self.project.id
        }
        
        # Step 1: Save the query to the database
        response = self.client.post(self.url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('cypher_query', response.json())
        self.assertIn('natural_language_query', response.json())

        # Step 2: Retrieve the query from the database
        saved_query = CustomQuery.objects.get(name="testing-making-query")
        query_id = saved_query.id
        response = self.client.get(reverse('customquery-detail', args=[query_id]), content_type='application/json')
        
        # Step 3: Print the response
        print("Query Response:", response.json())
        
        # # Step 4: Delete the query from the database
        # response = self.client.delete(reverse('customquery-detail', args=[query_id]), content_type='application/json')
        # self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # # Verify the query is deleted
        # with self.assertRaises(CustomQuery.DoesNotExist):
        #     CustomQuery.objects.get(name="testing-making-query")

if __name__ == "__main__":
    unittest.main()