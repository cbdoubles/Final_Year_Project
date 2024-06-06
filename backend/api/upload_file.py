import os
from neo4j import GraphDatabase

neo4j_user = os.getenv('NEO4J_USER')
neo4j_password = os.getenv('NEO4J_PASSWORD')
neo4j_dir = os.environ.get('NEO4J_HOME')
uri = "bolt://localhost:7687"

driver = GraphDatabase.driver(uri, auth=(neo4j_user, neo4j_password))

# Function to determine file format
#TODO - remove if it actually works
def determine_file_format(file_path):
    _, file_extension = os.path.splitext(file_path)
    return file_extension.lower()

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

# Function to import CSV data into Neo4j
def import_csv_data(tx, file_path):
    query = """
    CALL apoc.load.csv($csv_file_path) YIELD map
    CREATE (n:Data) SET n = map
    """
    tx.run(query, file_path=file_path)


# Function to set project_id for nodes and relationships
def set_project_id(tx, project_id):
    query_set_node_project_id = """
    MATCH (n) WHERE n.project_id IS NULL SET n.project_id = $project_id
    """
    tx.run(query_set_node_project_id, parameters={'project_id': project_id})

    query_set_relationship_project_id = """
    MATCH ()-[r]->() WHERE r.project_id IS NULL SET r.project_id = $project_id
    """
    tx.run(query_set_relationship_project_id, parameters={'project_id': project_id})

# Function to import GraphML data into Neo4j, currently works only for graphid = directed
def import_graphml_data(tx, file_path):
    #see if we can change the batch sizes to make it faster # for apoc.import.graphml
    #file_path is mandatory variable
    query = "CALL apoc.import.graphml($file_path, {})"
    tx.run(query, file_path=file_path)

def delete_file(file_path):
    """Delete file at specified path."""
    try:
        os.remove(file_path)
        print(f"File {file_path} has been deleted.")
    except FileNotFoundError:
        print(f"No file found at {file_path}.")
    except Exception as e:
        print(f"An error occurred while trying to delete file at {file_path}: {e}")

# Path to the uploaded file and it's name
def process_file(project_id, file_name):
    # Define the path to the Neo4j directory

    # Define the path to the downloads directory within the Neo4j directory
    #print(f"file_name: {file_name}")
    downloads_dir = os.path.join(neo4j_dir, 'downloads')
    # project_id = project_id

    # print(f"project_id: {project_id}")

    # Construct the file path
    file_path = os.path.join(downloads_dir, file_name)
    file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'
    file_format = determine_file_format(file_path)
    
    # Import data into Neo4j based on file format
    with driver.session() as session:
        if file_format == ".json":
            session.execute_write(import_json_data, file_path)
            session.execute_write(set_project_id, project_id)
            delete_file(file_path)
        elif file_format == ".csv":
            session.execute_write(import_csv_data, file_path)
            session.execute_write(set_project_id, project_id)
            delete_file(file_path)
        elif file_format == ".graphml":
            file_path_in_neo4j = os.path.join(file_path)  
            session.execute_write(import_graphml_data, "file:///" + file_path_in_neo4j.replace('\\', '/'))
            session.execute_write(set_project_id, project_id)
            delete_file(file_path)
        else:
            print(f"File path: {file_format}")
            print("Unsupported file format.")
            delete_file(file_path)