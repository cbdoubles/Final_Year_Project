from django.http import FileResponse, JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from py2neo import DatabaseError
from .neo4j_services import Neo4jService
from django.conf import settings
from .models import Query
import networkx as nx
from networkx.readwrite import json_graph
import os
import json
import requests
import errno
from .upload_file import process_file

# Initialize Neo4j connection
neo4j_service = Neo4jService('bolt://localhost:7687', 'neo4j', 'cobra-paprika-nylon-conan-tobacco-2599')

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('json_file'):
        uploaded_file = request.FILES['json_file']
        file_name = uploaded_file.name

        # Define the path to the Neo4j directory
        neo4j_dir = r"C:\Program Files\neo4j-community-5.19.0-windows\neo4j-community-5.19.0\data\databases\graph.db"

        # Define the path to the downloads directory within the Neo4j directory
        downloads_dir = os.path.join(neo4j_dir, 'downloads')

        # Construct the file path
        file_path = os.path.join(downloads_dir, file_name)
        file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'

        # Create the directory if it doesn't exist
        if not os.path.exists(os.path.dirname(file_path)):
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save the uploaded file to the file path
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Process the file
        process_file(file_name, neo4j_dir)
    
        return FileResponse(open(file_path, 'rb'))
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request'}, status=400)

#used for testing
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

@csrf_exempt
def graph_data(request):
    try:
        # Define the Cypher queries
        # Depending on the clients wishes we can keep the labels for both nodes and edges inside of properties
        query_nodes = """
        CALL apoc.export.json.query(
            "MATCH (n) 
            RETURN collect({data: {id: elementId(n), label: properties(n).labels, properties: apoc.map.removeKey(properties(n), 'labels')}}) AS nodes", 
            null, 
            {stream: true}
        )
        """

        query_edges = """
        CALL apoc.export.json.query(
            "MATCH (n)-[r]->(m) 
            RETURN collect({data: {id: elementId(r), source: elementId(startNode(r)), target: elementId(endNode(r)), label: type(r), properties: apoc.map.removeKey(properties(r), 'label')}}) AS edges", 
            null, 
            {stream: true}
        )
        """
        # Run the Cypher queries using the run_query method
        result_nodes = neo4j_service.run_query(query_nodes)[0]
        result_edges = neo4j_service.run_query(query_edges)[0]

        print(f"result_nodes: {result_nodes}")
        print(f"result_edges: {result_edges}")
        
        nodes_data_str = result_nodes['data']
        edges_data_str = result_edges['data']

        # Process the results
        nodes_data = json.loads(nodes_data_str)
        edges_data = json.loads(edges_data_str)

        # Prepare the graph data
        graph_data = {
            "nodes": nodes_data["nodes"],
            "edges": edges_data["edges"]
        }

        # Return the data as JSON
        return JsonResponse(graph_data)
    except Exception as e:
        return JsonResponse({'error': 'Neo4j query error', 'message': str(e)}, status=500)
  
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
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def run_query(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        query = data.get('query')

        # Run the Cypher query on the graph data
        result = neo4j_service.query_graph(query)

        # Process the results
        nodes_data_str = result['nodes']
        edges_data_str = result['edges']

        nodes_data = json.loads(nodes_data_str)
        edges_data = json.loads(edges_data_str)

        # Prepare the graph data
        graph_data = {
            "nodes": nodes_data,
            "edges": edges_data
        }

        # Return the data as JSON
        return JsonResponse(graph_data, safe=False)
    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=500)
