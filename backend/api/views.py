from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .neo4j_services import Neo4jService
from django.conf import settings
import os
import json
from .upload_file import process_file


# Get Neo4j parameters from environment variables
neo4j_user = os.getenv('NEO4J_USER')
neo4j_password = os.getenv('NEO4J_PASSWORD')
neo4j_service = Neo4jService('bolt://localhost:7687', neo4j_user, neo4j_password)
neo4j_dir = os.environ.get('NEO4J_HOME')

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('json_file'):
        uploaded_file = request.FILES['json_file']
        file_name = uploaded_file.name

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
        process_file(file_name)
    
        return FileResponse(open(file_path, 'rb'))
    else:
        return JsonResponse({'status': 'error', 'error': 'Invalid request'}, status=400)

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

#currently doesn't work
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
