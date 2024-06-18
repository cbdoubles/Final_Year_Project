import os
from django.conf import settings
from neo4j import GraphDatabase
import gc
import time

# Set up Neo4j connection
# values don't really matter just change them if needed
neo4j_user = os.getenv('NEO4J_USER')
neo4j_password = os.getenv('NEO4J_PASSWORD')
#neo4j_dir = os.environ.get('NEO4J_HOME')
uri = "bolt://localhost:7687"

driver = GraphDatabase.driver(uri, auth=(neo4j_user, neo4j_password))

def determine_file_format(file_path):
    _, file_extension = os.path.splitext(file_path)
    return file_extension.lower()

# Function to import CSV data into Neo4j
def import_csv_data(tx, file_path):
    query = """
    CALL apoc.load.csv($csv_file_path) YIELD map
    CREATE (n:Data) SET n = map
    """
    tx.run(query, file_path=file_path)

# Function to import JSON data into Neo4j
def import_json_data(tx, file_path):
    query = """
    CALL apoc.load.json($json_file_path) YIELD value
    UNWIND value.nodes AS node
    CREATE (n:Data) SET n = node.properties
    WITH value
    UNWIND value.edges AS edge
    MATCH (a:Data {id: edge.source}), (b:Data {id: edge.target})
    CREATE (a)-[:CONNECTS_TO]->(b)
    """
    tx.run(query, file_path=file_path)

# Function to import GraphML data into Neo4j, currently works only for graphid = directed
def import_graphml_data(tx, file_path):
    #see if we can change the batch sizes to make it faster # for apoc.import.graphml
    query = "CALL apoc.import.graphml($file_path, {})"
    tx.run(query, file_path=file_path)

# Function to set project_id for nodes and relationships
# Can be combined with fix_labels to avoid clutter in modify_file
def set_project_id(tx, project_id):
    query_set_node_project_id = """
    MATCH (n) WHERE n.project_id IS NULL SET n.project_id = $project_id
    """
    tx.run(query_set_node_project_id, parameters={'project_id': project_id})

    query_set_relationship_project_id = """
    MATCH ()-[r]->() WHERE r.project_id IS NULL SET r.project_id = $project_id
    """
    tx.run(query_set_relationship_project_id, parameters={'project_id': project_id})

def delete_file(file_path):
    """Delete file at specified path."""
    try:
        os.remove(file_path)
        print(f"File {file_path} has been deleted.")
    except FileNotFoundError:
        print(f"No file found at {file_path}.")
    except Exception as e:
        print(f"An error occurred while trying to delete file at {file_path}: {e}")

def clear_db(tx, project_id):
    query_delete_all = """
    MATCH (n {project_id: $project_id}) DETACH DELETE n
    """
    tx.run(query_delete_all, parameters={'project_id': project_id})

def fix_labels(tx, project_id):
    # Query to check if labels are null or empty
    query_check_labels = """
    MATCH (n {project_id: $project_id})
    RETURN labels(n) AS labels LIMIT 1
    """
    result = tx.run(query_check_labels, parameters={'project_id': project_id})
    labels = result.single().get('labels')

    # If labels are null or empty, fix the data
    if not labels:
        query_fix_labels = """
        MATCH (n {project_id: $project_id})
        WITH n, properties(n).labels AS nodeLabels, apoc.map.removeKey(properties(n), 'labels') AS newProps
        SET n = newProps
        WITH n, nodeLabels, newProps
        UNWIND nodeLabels AS label
        CALL apoc.create.addLabels(elementId(n), [label]) YIELD node
        WITH node, newProps
        SET node = newProps
        RETURN collect({data: {id: elementId(node), label: labels(node), properties: properties(node)}}) AS nodes
        """
        tx.run(query_fix_labels, parameters={'project_id': project_id})

def modify_file(project_id, file_data, reupload):
    # Save the file on the server
    try:
        file_path = os.path.join(settings.MEDIA_ROOT, file_data.name)
        with open(file_path, 'wb+') as destination:
            for chunk in file_data.chunks():
                destination.write(chunk)
        file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'
        file_format = determine_file_format(file_path)

        # You can add any additional file modification logic here @Nikola
        if reupload:
            clear_db(project_id)

        # Import data into Neo4j based on file format
        try:
            with driver.session() as session:
                if file_format == ".json":
                    session.execute_write(import_json_data, file_path)
                    session.execute_write(set_project_id, project_id)
                    session.execute_write(fix_labels, project_id)
                elif file_format == ".csv":
                    session.execute_write(import_csv_data, file_path)
                    session.execute_write(set_project_id, project_id)
                    session.execute_write(fix_labels, project_id)
                elif file_format == ".graphml":
                    file_path_in_neo4j = os.path.join(file_path)  
                    session.execute_write(import_graphml_data, "file:///" + file_path_in_neo4j.replace('\\', '/'))
                    session.execute_write(set_project_id, project_id)
                    session.execute_write(fix_labels, project_id)
                else:
                    print(f"File path: {file_format}")
                    print("Unsupported file format.")
        except Exception as e:
            print(f"An error occurred during Neo4j transaction: {e}")
        finally:
            driver.close()
            print("Driver closed")
        gc.collect()
        time.sleep(5)
        delete_file(file_path)
    except Exception as e:
        print(f"An error occurred while trying to modify the file: {e}")
