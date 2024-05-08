from neo4j import GraphDatabase

uri = "bolt://localhost:7687"
user = "admin"
password = "password"

class Neo4jService:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def create_person(self, name):
        with self.driver.session() as session:
            result = session.write_transaction(self._create_and_return_person, name)
            return result

    def get_person(self, name):
        with self.driver.session() as session:
            result = session.read_transaction(self._get_and_return_person, name)
            return result

    @staticmethod
    def _create_and_return_person(tx, name):
        query = (
            "CREATE (p:Person {name: $name}) "
            "RETURN p.name AS name"
        )
        result = tx.run(query, name=name)
        return result.single()[0]

    @staticmethod
    def _get_and_return_person(tx, name):
        query = (
            "MATCH (p:Person {name: $name}) "
            "RETURN p.name AS name"
        )
        result = tx.run(query, name=name)
        return result.single()[0]
