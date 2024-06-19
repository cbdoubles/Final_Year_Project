# Test Retrieval of List of Queries: Ensure that you can retrieve the list of queries.
# Test Retrieval of a Single Query: Ensure that you can retrieve a single query by its ID.
# Test Create Query (Should Fail): Ensure that creating a new query is not allowed.
# Test Update Query (Should Fail): Ensure that updating an existing query is not allowed.
# Test Delete Query (Should Fail): Ensure that deleting an existing query is not allowed.

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from ..models import DefaultQuery


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_query():
    return DefaultQuery.objects.create(
        name='Test Default Query',
        cypher_query='MATCH (n) RETURN n',
        natural_language_query='Show me all nodes'
    )


@pytest.fixture
def create_queries():
    queries = [
        DefaultQuery.objects.create(
            name=f'Test Query {i}',
            cypher_query='MATCH (n) RETURN n',
            natural_language_query=f'Get all nodes {i}'
        )
        for i in range(5)  # Creating 5 queries for testing
    ]
    return queries


@pytest.mark.django_db
def test_list_queries(api_client, create_query):
    url = reverse('defaultquery-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)


@pytest.mark.django_db
def test_list_queries_returns_all_queries(api_client, create_queries):
    url = reverse('defaultquery-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    results = response.json()

    # Check that the number of returned queries matches the number created
    assert len(results) == len(create_queries)

    # Check that each query in the response matches the created queries
    for query in create_queries:
        assert any(res['id'] == query.id for res in results)
        assert any(res['name'] == query.name for res in results)
        assert any(res['cypher_query'] ==
                   query.cypher_query for res in results)
        assert any(res['natural_language_query'] ==
                   query.natural_language_query for res in results)


@pytest.mark.django_db
def test_retrieve_query(api_client, create_query):
    url = reverse('defaultquery-detail', args=[create_query.id])
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['id'] == create_query.id
    assert response.json()['name'] == create_query.name
    assert response.json()['cypher_query'] == create_query.cypher_query
    assert response.json()[
        'natural_language_query'] == create_query.natural_language_query


@pytest.mark.django_db
def test_create_query_not_allowed(api_client):
    url = reverse('defaultquery-list')
    data = {
        'name': 'Test Creation',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Show me all nodes'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_update_query_not_allowed(api_client, create_query):
    url = reverse('defaultquery-detail', args=[create_query.id])
    data = {'name': 'Updated Name'}
    response = api_client.patch(url, data, format='json')
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_put_query_not_allowed(api_client, create_query):
    url = reverse('defaultquery-detail', args=[create_query.id])
    data = {
        'name': 'Updated Name',
        'cypher_query': 'MATCH (n) RETURN n',
        'natural_language_query': 'Show me all nodes'
    }
    response = api_client.put(url, data, format='json')
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_delete_query_not_allowed(api_client, create_query):
    url = reverse('defaultquery-detail', args=[create_query.id])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
