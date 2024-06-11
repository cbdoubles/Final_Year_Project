"""
upload_file.py

This module contains functions for importing data from various file formats into a Neo4j database.
The supported file formats are JSON, CSV, and GraphML.

Functions:
- determine_file_format(file_path: str) -> str:
    Determines the file format of a given file based on its extension.

- import_json_data(tx: neo4j.Transaction, data: dict) -> None:
    Imports JSON data into a Neo4j database.

- import_csv_data(tx: neo4j.Transaction, csv_file: str) -> None:
    Imports CSV data into a Neo4j database.

- import_graphml_data(tx: neo4j.Transaction, xml_string: str) -> None:
    Imports GraphML data into a Neo4j database.

- process_file(file_name: str) -> None:
    Processes the given file and imports its data into a Neo4j database.

This module also establishes a connection to a Neo4j database upon import.
"""
import os
import json
import csv
from xml.etree import ElementTree as ET
from neo4j import AsyncGraphDatabase

# Function to determine file format
def determine_file_format(file_path):
    """
    Determine the file format of a given file.

    This function uses the file extension to determine the file format.
    The file extension is converted to lowercase to ensure consistency.

    Parameters:
    file_path (str): The path of the file.

    Returns:
    str: The file extension in lowercase.
    """
    _, file_extension = os.path.splitext(file_path)
    return file_extension.lower()

# Function to import JSON data into Neo4j
async def import_json_data(tx, data, project_label="default_label"):
    """
    Import JSON data into a Neo4j database.

    This function takes a transaction and a data dictionary as parameters.
    The data dictionary should have two keys: "nodes" and "edges".
    The "nodes" key should map to a list of dictionaries, each representing a node.
    The "edges" key should map to a list of dictionaries, each representing an edge.
    Each edge dictionary should have "source" and "target" keys,
    representing the IDs of the nodes it connects.

    Parameters:
    tx (neo4j.Transaction): The transaction to run the queries in.
    data (dict): The data to import. Should have "nodes" and "edges" keys.

    Returns:
    None
    """
    for node in data["nodes"]:
        await tx.run(f"CREATE (n:Data:{project_label} $props)", props=node)

    for edge in data["edges"]:
        query = f"""
        MATCH (a:Data:{project_label} {{id: $source}}), (b:Data:{project_label} {{id: $target}})
        CREATE (a)-[:CONNECTS_TO]->(b)
        """
        await tx.run(query, source=edge["source"], target=edge["target"])

# Function to import CSV data into Neo4j
async def import_csv_data(tx, csv_file, project_label="default_label"):
    """
    Import CSV data into a Neo4j database.

    This function takes a transaction and a CSV file path as parameters.
    It reads the CSV file, treating each row as a dictionary representing a node,
    and creates a corresponding node in the database.

    Parameters:
    tx (neo4j.Transaction): The transaction to run the queries in.
    csv_file (str): The path to the CSV file to import.

    Returns:
    None
    """
    async with aiofiles.open(csv_file, "r", encoding="utf_8") as file:
        reader = csv.DictReader(await file.read().splitlines())
        for row in reader:
            await tx.run(f"CREATE (n:Data:{project_label} $props)", props=row)

# Function to import GraphML data into Neo4j
async def import_graphml_data(tx, xml_string, project_label="default_label"):
    """
    Import GraphML data into a Neo4j database.

    This function takes a transaction and a GraphML XML string as parameters.
    It parses the XML string, creates nodes and edges in the database based on the GraphML data.

    Parameters:
    tx (neo4j.Transaction): The transaction to run the queries in.
    xml_string (str): The GraphML data in XML format.

    Returns:
    None
    """
    root = ET.fromstring(xml_string)
    keys = {
        key.attrib["id"]: key.attrib.get("attr.name", "")
        for key in root.findall(".//{http://graphml.graphdrawing.org/xmlns}key")
    }

    for node in root.findall(".//{http://graphml.graphdrawing.org/xmlns}node"):
        node_id = node.attrib["id"]
        props = {
            keys[data.attrib["key"]]: data.text for data in node.findall(
                ".//{http://graphml.graphdrawing.org/xmlns}data") if data.attrib["key"] in keys
        }
        props.pop("id", None)
        query = f"CREATE (n:Data:{project_label} {{id: $id, " + \
            ", ".join(f"{k}: ${k}" for k in props.keys()) + "}}) RETURN n"
        await tx.run(query, id=node_id, **props)

    for edge in root.findall(".//{http://graphml.graphdrawing.org/xmlns}edge"):
        source = edge.attrib["source"]
        target = edge.attrib["target"]
        props = {
            keys[data.attrib["key"]]: data.text for data in edge.findall(
                ".//{http://graphml.graphdrawing.org/xmlns}data")
        }
        props.pop("id", None)

        query = f"""
            MATCH (a:Data:{project_label} {{id: $source}})
            MATCH (b:Data:{project_label} {{id: $target}})
            MERGE (a)-[r:CONNECTS_TO]->(b)
        """
        for key, value in props.items():
            query += f" SET r.{key} = '{value}'"
        query += " RETURN r"
        await tx.run(query, source=source, target=target)

# Connect to Neo4j
URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "cobra-paprika-nylon-conan-tobacco-2599"
driver = AsyncGraphDatabase.driver(URI, auth=(USER, PASSWORD))

async def process_file(file_name, project_label="default_label"):
    """
    Process the given file and import its data into a Neo4j database.

    This function determines the format of the file based on its extension,
    reads the file, and imports the data into Neo4j using the appropriate function
    for the file format. It supports JSON, CSV, and GraphML formats.

    Parameters:
    file_name (str): The name of the file to process.

    Returns:
    None
    """
    current_dir = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(current_dir, "downloads", file_name)
    file_path = os.path.normpath(file_path)
    file_format = determine_file_format(file_path)

    async with driver.session() as session:
        if file_format == ".json":
            async with aiofiles.open(file_path, "r", encoding="utf_8") as file:
                data = json.loads(await file.read())
            await session.execute_write(import_json_data, data, project_label)
        elif file_format == ".csv":
            await session.execute_write(import_csv_data, file_path, project_label)
        elif file_format == ".graphml":
            async with aiofiles.open(file_path, "r", encoding="utf_8") as file:
                xml_string = await file.read()
            await session.execute_write(import_graphml_data, xml_string, project_label)
        else:
            print(f"File path: {file_format}")
            print("Unsupported file format.")