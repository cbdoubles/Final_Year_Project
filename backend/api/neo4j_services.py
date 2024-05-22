"""
This module provides a service for interacting with a Neo4j database.

It includes a class, Neo4jService, which provides methods for establishing
a connection to a Neo4j database, running Cypher queries against the database,
and converting the results into a more usable format. It also provides methods
for modifying Cypher queries to ensure they return a result,
and for extracting nodes and relationships from a text string.

The module uses the neo4j package to interact with the Neo4j database,
and the re package for regular expressions.

The module defines a URI, user, and password for connecting to the Neo4j database.
These should be replaced with the actual URI, user, and password for your Neo4j database.

Classes:
    Neo4jService: A service for interacting with a Neo4j database.
"""

import re
from neo4j import GraphDatabase

URI = "bolt://localhost:7687"
USER = "admin"
PASSWORD = "password"


class Neo4jService:
    """
    A service class for interacting with a Neo4j database.

    This class provides methods for establishing a connection to a Neo4j database,
    running Cypher queries against the database,
    and converting the results into a more usable format.
    It also provides methods for modifying Cypher queries to ensure they return a result,
    and for extracting nodes and relationships from a text string.

    Attributes:
    driver (neo4j.Driver): The driver for the Neo4j database.

    Methods:
    __init__(self, uri, user, password): Initialize a new instance of the class.
    close(self): Close the connection to the Neo4j database.
    run_query(self, query): Run a Cypher query against the Neo4j database.
    modify_query(self, query): Modify a Cypher query to ensure it returns a result.
    node_to_dict(self, node): Convert a Neo4j node to a dictionary.
    rel_to_dict(self, rel): Convert a Neo4j relationship to a dictionary.
    extract_relations(text): Extract relations from a text string.
    extract_nodes(text): Extract nodes from a text string.
    query_graph(self, query): Query the graph and return nodes and relationships.
    """

    def __init__(self, uri, user, password):
        """
        Initialize a new instance of the class.
        This method creates a new driver for the Neo4j database
        using the provided URI, user, and password.
        Parameters:
        uri (str): The URI of the Neo4j database.
        user (str): The username to authenticate with the Neo4j database.
        password (str): The password to authenticate with the Neo4j database.
        """
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        """
        Close the connection to the Neo4j database.
        This method closes the driver for the Neo4j database,
        effectively closing the connection.
        """
        self.driver.close()

    def run_query(self, query):
        """
        Run a Cypher query against the Neo4j database.
        This method opens a new session with the Neo4j database,
        runs the provided Cypher query, 
        and returns the results as a list of records.
        Parameters:
        query (str): The Cypher query to run.
        Returns:
        list: The results of the query as a list of records.
        """
        with self.driver.session() as session:
            result = session.run(query)
            return list(result)

    def modify_query(self, query):
        """
        Modify a Cypher query to ensure it returns a result.

        This method checks if the provided Cypher query includes a "return" clause.
        If it does, and the clause includes "r", the original query is returned.
        If not, ",r" is appended to the query to ensure it returns a result.

        Parameters:
        query (str): The Cypher query to modify.

        Returns:
        str: The modified Cypher query.
        """
        lower_query = query.lower()

        return_pos = lower_query.find("return")

        if return_pos != -1:
            after_return = query[return_pos + 6:]
            if "r" in after_return:
                return query
        modified_query = query + ",r"
        return modified_query

    def node_to_dict(self, node):
        """
        Convert a Neo4j node to a dictionary.

        This method takes a Neo4j node and converts it
        into a dictionary with keys for the element_id, 
        labels, and properties of the node.

        Parameters:
        node (neo4j.Node): The Neo4j node to convert.

        Returns:
        dict: The converted node as a dictionary.
        """
        return {
            "element_id": node.element_id,
            "labels": list(node.labels),
            "properties": dict(node.items())
        }

    def rel_to_dict(self, rel):
        """
        Convert a Neo4j relationship to a dictionary.

        This method takes a Neo4j relationship and converts it
        into a dictionary with keys for the element_id, type, properties, start_node,
        and end_node of the relationship. The start_node and end_node are 
        converted to dictionaries using the node_to_dict method.

        Parameters:
        rel (neo4j.Relationship): The Neo4j relationship to convert.

        Returns:
        dict: The converted relationship as a dictionary.
        """
        return {
            "element_id": rel.element_id,
            "type": rel.type,
            "properties": dict(rel.items()),
            "start_node": self.node_to_dict(rel.start_node),
            "end_node": self.node_to_dict(rel.end_node)
        }

    def extract_relations(self, text):
        """
        Extract relations from a text string.

        This method uses a regular expression to find all substrings
        that are enclosed in parentheses. 
        These substrings are returned as a list.

        Parameters:
        text (str): The text to extract relations from.

        Returns:
        list: The extracted relations as a list of strings.
        """
        pattern = r"\((.*?)\)"
        matches = re.findall(pattern, text)
        return matches

    def extract_nodes(self, text):
        """
        Extract nodes from a text string.

        This method uses a regular expression to find all substrings
        that are enclosed in square brackets and within parentheses.
        These substrings are returned as a list.

        Parameters:
        text (str): The text to extract nodes from.

        Returns:
        list: The extracted nodes as a list of strings.
        """
        pattern = r"\(\[.*?\]\)"
        matches = re.findall(pattern, text)
        return matches

    def query_graph(self, query):
        """
        Query the graph and return nodes and relationships.

        This method modifies the provided Cypher query to ensure it returns a result,
        then runs the query against the Neo4j database.
        It extracts nodes and relationships from the query results,
        converts them to dictionaries, and returns them as a list of nodes and relationships.

        Parameters:
        query (str): The Cypher query to run.

        Returns:
        list: A list containing two lists: the first list contains the nodes as dictionaries,
        and the second list contains the relationships as dictionaries.
        """
        query = self.modify_query(query)

        match = re.search("RETURN (.*)", query, re.IGNORECASE)
        if match:
            variables = match.group(1).split(",")
            variables = [var.strip() for var in variables]

        print(list(variables))

        nodes = {}
        final_nodes = {}
        edges = {}
        final_edges = {}

        relation = self.extract_relations(query)[0]
        node = self.extract_nodes(relation)[0]

        with self.driver.session() as session:
            result = session.run(query)
            for record in result:
                for key in record.keys():
                    name = record[key].element_id
                    if key.startswith(node) and name not in nodes:
                        nodes[name] = record[key]
                    if key.startswith(relation) and name not in edges:
                        edges[name] = record[key]

        for node_id, node_value in nodes.items():
            final_nodes[node_id] = self.node_to_dict(node_value)

        for edge_id, edge_value in edges.items():
            start_id = edge_value.start_node.element_id
            end_id = edge_value.end_node.element_id

            if start_id not in nodes or end_id not in nodes:
                continue

            final_edges[edge_id] = self.rel_to_dict(edge_value)

        return [list(final_nodes.values()), list(final_edges.values())]
