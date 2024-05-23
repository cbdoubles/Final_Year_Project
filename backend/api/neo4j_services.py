from neo4j import GraphDatabase
import re

uri = "bolt://localhost:7687"
user = "admin"
password = "password"

class Neo4jService:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def run_query(self, query):
        with self.driver.session() as session:
            result = session.run(query)
            return list(result)

    def modify_query(self, query):
        lower_query = query.lower()

        return_pos = lower_query.find("return")

        if return_pos != -1:
            after_return = query[return_pos + 6:]
            if "r" in after_return:
                return query
        modified_query = query + ",r"
        return modified_query

    def node_to_dict(self, node):
        return {
            "element_id": node.element_id,
            "labels": list(node.labels),
            "properties": dict(node.items())
        }

    def rel_to_dict(self, rel):
        return {
            "element_id": rel.element_id,
            "type": rel.type,
            "properties": dict(rel.items()),
            "start_node": self.node_to_dict(rel.start_node),
            "end_node": self.node_to_dict(rel.end_node)
        }

    def extract_relations(self, text):
        pattern = r"\((.*?)\)"
        matches = re.findall(pattern, text)
        return matches

    def extract_nodes(self, text):
        pattern = r"\(\[.*?\]\)"
        matches = re.findall(pattern, text)
        return matches

    def query_graph(self, query):
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