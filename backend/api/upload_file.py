import os
import json
import csv
from neo4j import GraphDatabase
import sqlite3
from xml.etree import ElementTree as ET


# Function to determine file format
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


# Function to import GraphML data into Neo4j, currently works only for graphid = directed
def import_graphml_data(tx, file_path):
    query = "CALL apoc.import.graphml($file_path, {})"
    tx.run(query, file_path=file_path)

# Connect to Neo4j
uri = "bolt://localhost:7687"
user = 'neo4j'
password = 'cobra-paprika-nylon-conan-tobacco-2599'
driver = GraphDatabase.driver(uri, auth=(user, password))

# Path to the uploaded file and it's name
def process_file(file_name):
    # Define the path to the Neo4j directory
    neo4j_dir = r"C:\Program Files\neo4j-community-5.19.0-windows\neo4j-community-5.19.0\data\databases\graph.db"

    # Define the path to the downloads directory within the Neo4j directory
    downloads_dir = os.path.join(neo4j_dir, 'downloads')

    # Construct the file path
    file_path = os.path.join(downloads_dir, file_name)
    file_path = os.path.normpath(file_path)  # Normalize the path, resolve any '..'
    file_format = determine_file_format(file_path)
    
    # Import data into Neo4j based on file format
    with driver.session() as session:
        if file_format == ".json":
            session.write_transaction(import_json_data, file_path)
        elif file_format == ".csv":
            session.write_transaction(import_csv_data, file_path)
        elif file_format == ".graphml":
            file_path_in_neo4j = os.path.join(file_path)  # Correctly set the file path in Neo4j
            session.write_transaction(import_graphml_data, "file:///" + file_path_in_neo4j.replace('\\', '/'))
        else:
            print(f"File path: {file_format}")
            print("Unsupported file format.")