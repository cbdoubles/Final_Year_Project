from django.http import FileResponse, JsonResponse, HttpResponse
from .neo4j_services import Neo4jService
from django.views.decorators.csrf import csrf_exempt
#from django.views.decorators.http import require_http_methods
from py2neo import DatabaseError
from django.conf import settings
from .models import Query
import networkx as nx
from networkx.readwrite import json_graph
#from neo4j import GraphDatabase
import os
import json
import requests

# Initialize Neo4j connection
neo4j_service = Neo4jService('neo4j://localhost:7687', 'neo4j', 'cobra-paprika-nylon-conan-tobacco-2599')

@csrf_exempt 
def download_file(request):
    if request.method == 'POST' and request.FILES.get('json_file'):
        uploaded_file = request.FILES['json_file']
        file_name = uploaded_file.name
        current_dir = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(current_dir, '..', 'api', 'downloads', file_name)
        file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'
        if not os.path.exists(os.path.dirname(file_path)):
            try:
                os.makedirs(os.path.dirname(file_path))
            except OSError as exc:  # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        return FileResponse(open(file_path, 'rb'))
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request'}, status=400)

def save_graph(request):
    #example graph to test sql database
    G = nx.Graph()
    G.add_edge('A', 'B')

    # Convert the graph to a string
    data = json_graph.node_link_data(G)
    graph_json = json.dumps(data)

    # Save the graph to the database
    # django automatically assigns an ID incrementally to the object 
    query = Query(cypher_query='MATCH (n) RETURN n', natural_query='Return all nodes', graph=graph_json)
    query.save()

    return HttpResponse('Graph saved successfully')

def view_graph(request, query_id):
    # Get the Query object with the given ID
    query = Query.objects.get(id=query_id)

    # Get the graph as a string
    graph_json = query.graph

    # Convert the string back to a graph
    #data = json.loads(graph_json)
    #G = json_graph.node_link_graph(data)

    # Return the Query object in the HTTP response
    return HttpResponse(f'Graph retrieved successfully: Cypher query: {query.cypher_query}, Natural query: {query.natural_query}, Graph: {graph_json}')

@csrf_exempt
def graph_data(request):
    # Define the Cypher queries
    query_nodes = "MATCH (n) RETURN id(n) AS id, elementId(n) AS elementId, properties(n) AS properties"
    query_edges = "MATCH (n)-[r]->(m) RETURN id(r) AS id, type(r) AS type, elementId(n) AS startId, elementId(m) AS endId, properties(r) AS properties"

    # Run the Cypher queries using the run_query method
    result_nodes = neo4j_service.run_query(query_nodes)
    result_edges = neo4j_service.run_query(query_edges)

    # Process the results
    nodes = [{"id": record["id"], "elementId": record["elementId"], **record["properties"]} for record in result_nodes]
    edges = [{"id": record["id"], "source": record["startId"], "target": record["endId"], "type": record["type"], **record["properties"]} for record in result_edges]

    # Return the data as JSON
    return JsonResponse({"nodes": nodes, "edges": edges})

@csrf_exempt
def cypher_query(request):
    try:
        # Get the Cypher query and save parameter from the request
        data = json.loads(request.body)
        cypher_query = data.get('cypher_query')
        natural_query = data.get('natural_query')
        if not natural_query:
            # empty -> mpty -> mty -> mt
            natural_query = "mt"  
        save = data.get('save')

        # Run the Cypher query
        results = neo4j_service.run_query(cypher_query)

        # If save is True, save the query to the database
        if save:
            for record in results:
                # Convert the record to a string and save it to the database
                graph = str(record[0])  # convert the first field of the record to a string
                query = Query(cypher_query=cypher_query, natural_query=natural_query, graph=graph)
                query.save()

        # Return the results as JSON
        return JsonResponse([str(record[0]) for record in results], safe=False)
    except DatabaseError as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def run_query(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        query = data.get('query')

        # Send a POST request to the graph_data URL
        response = requests.post('http://127.0.0.1:8000/api/graphData')
        original_graph_data = response.json()
        nodes = original_graph_data['nodes']
        edges = original_graph_data['edges']

        # Run the Cypher query on the graph data
        # This is a placeholder, replace with your actual logic
        new_graph_data = neo4j_service.query_graph(nodes, edges, query)

        # Process the results
        nodes = new_graph_data['nodes']
        edges = new_graph_data['edges']
        # Return the new graph data
        return JsonResponse({"nodes": nodes, "edges": edges}, safe=False)
    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=400)