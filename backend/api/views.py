from django.http import FileResponse, JsonResponse, HttpResponse
from .neo4j_services import Neo4jService
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import Query
import networkx as nx
from networkx.readwrite import json_graph
from neo4j import GraphDatabase
import os
import json

# Initialize Neo4j connection
neo4j_service = Neo4jService('bolt://localhost:7687', 'admin', 'password')

@csrf_exempt # THIS SHIT IS THE GOAT (FIXED HTTP ERROR 403)
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
    data = json.loads(graph_json)
    G = json_graph.node_link_graph(data)

    # actual implementation

    # Return the Query object in the HTTP response
    return HttpResponse(f'Graph retrieved successfully: Cypher query: {query.cypher_query}, Natural query: {query.natural_query}, Graph: {graph_json}')
def graph_data(request):
    # Create a driver for your Neo4j database
    driver = GraphDatabase.driver("neo4j://localhost:7687", auth=("neo4j", "cobra-paprika-nylon-conan-tobacco-2599"))

    # Start a new session
    with driver.session() as session:
        # Run a Cypher query to fetch all nodes with auto-generated ID and properties
        result = session.run("MATCH (n) RETURN id(n) AS id, elementId(n) AS elementId, properties(n) AS properties")
        nodes = [{"id": record["id"], "elementId": record["elementId"], **record["properties"]} for record in result]

        # Run a Cypher query to fetch all edges
        result = session.run("MATCH (n)-[r]->(m) RETURN id(r) AS id, type(r) AS type, elementId(n) AS startId, elementId(m) AS endId, properties(r) AS properties")
        edges = [{"id": record["id"], "source": record["startId"], "target": record["endId"], "type": record["type"], **record["properties"]} for record in result]

    # Return the data as JSON
    return JsonResponse({"nodes": nodes, "edges": edges})