from neo4j import GraphDatabase
import re
import os

neo4j_user = os.getenv('NEO4J_USER')
neo4j_password = os.getenv('NEO4J_PASSWORD')

uri = "bolt://localhost:7687"
user = neo4j_user
password = neo4j_password

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

