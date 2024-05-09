from django.http import FileResponse, JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from .neo4j_services import Neo4jService
from django.conf import settings
from .models import Query
import networkx as nx
from networkx.readwrite import json_graph
from neo4j import GraphDatabase
import os
import json
import errno

# Initialize Neo4j connection
neo4j_service = Neo4jService('bolt://localhost:7687', 'admin', 'password')

@csrf_exempt
def download_file(request):
    if request.method == 'POST' and request.FILES.get('json_file'):
        uploaded_file = request.FILES['json_file']
        file_name = uploaded_file.name
        current_dir = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(current_dir, '..', 'api', 'downloads', file_name)
        file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'
        if not os.path.exists(os.path.dirname(file_path)):
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        return FileResponse(open(file_path, 'rb'))
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request'}, status=400)

def save_graph(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    G = nx.Graph()
    G.add_edge('A', 'B')
    data = json_graph.node_link_data(G)
    graph_json = json.dumps(data)

    query = Query(cypher_query='MATCH (n) RETURN n', natural_query='Return all nodes', graph=graph_json)
    query.save()

    return JsonResponse({'message': 'Graph saved successfully'}, status=201)

def view_graph(request, query_id):
    try:
        query = Query.objects.get(id=query_id)
    except Query.DoesNotExist:
        raise Http404("Graph not found")

    graph_json = query.graph
    data = json.loads(graph_json)
    G = json_graph.node_link_graph(data)

    return JsonResponse({
        'message': 'Graph retrieved successfully',
        'cypher_query': query.cypher_query,
        'natural_query': query.natural_query,
        'graph': graph_json
    })

def graph_data(request):
    try:
        driver = GraphDatabase.driver("neo4j://localhost:7687", auth=("neo4j", "password"))
        with driver.session() as session:
            nodes = session.run("MATCH (n) RETURN id(n) AS id, properties(n) AS properties")
            edges = session.run("MATCH (n)-[r]->(m) RETURN id(r) AS id, startNode(r) AS startId, endNode(r) AS endId, properties(r) AS properties")
            
            nodes = [{'id': record['id'], **record['properties']} for record in nodes]
            edges = [{'id': record['id'], 'source': record['startId'], 'target': record['endId'], **record['properties']} for record in edges]

        return JsonResponse({'nodes': nodes, 'edges': edges})
    except Exception as e:
        return JsonResponse({'error': 'Neo4j query error', 'message': str(e)}, status=500)
