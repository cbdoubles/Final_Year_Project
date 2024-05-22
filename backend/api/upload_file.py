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


def import_json_data(tx, data):
    # Import nodes
    for node in data["nodes"]:
        tx.run("CREATE (n:Data $props)", props=node)

    # Import edges
    for edge in data["edges"]:
        query = """
        MATCH (a:Data {id: $source}), (b:Data {id: $target})
        CREATE (a)-[:CONNECTS_TO]->(b)
        """
        tx.run(query, source=edge["source"], target=edge["target"])

# Function to import CSV data into Neo4j, has to be fixed


def import_csv_data(tx, csv_file):
    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            tx.run("CREATE (n:Data $props)", props=row)


# Function to import GraphML data into Neo4j, currently works only for graphid = directed
def import_graphml_data(tx, xml_string):
    root = ET.fromstring(xml_string)
    keys = {key.attrib['id']: key.attrib.get('attr.name', '') for key in root.findall(
        './/{http://graphml.graphdrawing.org/xmlns}key')}

    for node in root.findall('.//{http://graphml.graphdrawing.org/xmlns}node'):
        node_id = node.attrib['id']
        props = {keys[data.attrib['key']]: data.text for data in node.findall(
            './/{http://graphml.graphdrawing.org/xmlns}data') if data.attrib['key'] in keys}
        props.pop('id', None)  # Remove 'id' from props if it exists
        query = "CREATE (n:Data {id: $id, " + \
            ', '.join(f'{k}: ${k}' for k in props.keys()) + "}) RETURN n"
        tx.run(query, id=node_id, **props)

    for edge in root.findall('.//{http://graphml.graphdrawing.org/xmlns}edge'):
        source = edge.attrib['source']
        target = edge.attrib['target']
        props = {keys[data.attrib['key']]: data.text for data in edge.findall(
            './/{http://graphml.graphdrawing.org/xmlns}data')}
        props.pop('id', None)  # Remove 'id' from props if it exists

        query = """
            MATCH (a:Data {id: $source})
            MATCH (b:Data {id: $target})
            MERGE (a)-[r:CONNECTS_TO]->(b)
        """
        for key, value in props.items():
            query += f" SET r.{key} = '{value}'"
        query += " RETURN r"
        tx.run(query, source=source, target=target)


# Connect to Neo4j
uri = "bolt://localhost:7687"
user = 'neo4j'
password = 'cobra-paprika-nylon-conan-tobacco-2599'
driver = GraphDatabase.driver(uri, auth=(user, password))


# Path to the uploaded file and it's name
def process_file(file_name):
    current_dir = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(current_dir, 'downloads', file_name)
    # Normalize the path, resolve any '..'
    file_path = os.path.normpath(file_path)
    file_format = determine_file_format(file_path)

    # Import data into Neo4j based on file format
    with driver.session() as session:
        if file_format == ".json":
            with open(file_path, 'r') as file:
                data = json.load(file)
            session.execute_write(import_json_data, data)
        elif file_format == ".csv":
            session.execute_write(import_csv_data, file_path)
        elif file_format == ".graphml":
            with open(file_path, 'r') as file:
                xml_string = file.read()
            session.execute_write(import_graphml_data, xml_string)
        else:
            print(f"File path: {file_format}")
            print("Unsupported file format.")
