import os
from django.conf import settings
from neo4j import GraphDatabase
import atexit

class FileService:
    def __init__(self):
        self.neo4j_user = os.getenv('NEO4J_USER')
        self.neo4j_password = os.getenv('NEO4J_PASSWORD')
        self.uri = "bolt://localhost:7687"
        self.driver = GraphDatabase.driver(self.uri, auth=(self.neo4j_user, self.neo4j_password))

    @staticmethod
    def determine_file_format(file_path):
        _, file_extension = os.path.splitext(file_path)
        return file_extension.lower()

    def import_csv_data(self, tx, file_path):
        query = """
        CALL apoc.load.csv($csv_file_path) YIELD map
        CREATE (n:Data) SET n = map
        """
        tx.run(query, file_path=file_path)

    def import_json_data(self, tx, json_file_path):
        query = """
        CALL apoc.load.json($json_file_path) YIELD value
        UNWIND value.nodes AS node
        CREATE (n:Data) SET n = node.properties
        WITH value
        UNWIND value.edges AS edge
        MATCH (a:Data {id: edge.source}), (b:Data {id: edge.target})
        CREATE (a)-[:CONNECTS_TO]->(b)
        """
        tx.run(query, json_file_path=json_file_path)

    def import_graphml_data(self, tx, file_path):
        query = "CALL apoc.import.graphml($file_path, {})"
        tx.run(query, file_path=file_path)

    def set_project_id(self, tx, project_id):
        query_set_node_project_id = """
        MATCH (n) WHERE n.project_id IS NULL SET n.project_id = $project_id
        """
        tx.run(query_set_node_project_id, parameters={'project_id': project_id})

        query_set_relationship_project_id = """
        MATCH ()-[r]->() WHERE r.project_id IS NULL SET r.project_id = $project_id
        """
        tx.run(query_set_relationship_project_id, parameters={'project_id': project_id})

    @staticmethod
    def delete_file(file_path):
        try:
            os.remove(file_path)
            print(f"File {file_path} has been deleted.")
        except FileNotFoundError:
            print(f"No file found at {file_path}.")
        except Exception as e:
            print(f"An error occurred while trying to delete file at {file_path}: {e}")

    def clear_db(self, tx, project_id):
        query_delete_all = """
        MATCH (n {project_id: $project_id}) DETACH DELETE n
        """
        tx.run(query_delete_all, parameters={'project_id': project_id})

    def fix_labels(self, tx, project_id):
        query_check_labels = """
        MATCH (n {project_id: $project_id})
        RETURN labels(n) AS labels LIMIT 1
        """
        result = tx.run(query_check_labels, parameters={'project_id': project_id})
        labels = result.single().get('labels')

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

    def modify_file(self, project_id, file_data, reupload):
        try:
            file_path = os.path.join(settings.MEDIA_ROOT, file_data.name)
            with open(file_path, 'wb+') as destination:
                for chunk in file_data.chunks():
                    destination.write(chunk)
            file_path = os.path.normpath(file_path)
            file_format = self.determine_file_format(file_path)

            if reupload:
                try: 
                    with self.driver.session() as session:
                        session.execute_write(self.clear_db, project_id)
                        self.driver.close()
                except Exception as e:
                    print(f"An error occurred reuploading the data {e}")
                    self.driver.close()

            try:
                with self.driver.session() as session:
                    file_path_in_neo4j = os.path.join(file_path)
                    modified_file_path = "file:///" + file_path_in_neo4j.replace('\\', '/')
                    if file_format == ".json":
                        session.execute_write(self.import_json_data, modified_file_path)
                    elif file_format == ".csv":
                        session.execute_write(self.import_csv_data, modified_file_path)
                    elif file_format == ".graphml": 
                        session.execute_write(self.import_graphml_data, modified_file_path)
                    else:
                        print(f"File path: {file_format}")
                        print("Unsupported file format.")

                    session.execute_write(self.set_project_id, project_id)
                    session.execute_write(self.fix_labels, project_id)  
            except Exception as e:
                print(f"An error occurred during Neo4j transaction: {e}")
            self.delete_file(file_path)
        except Exception as e:
            print(f"An error occurred while trying to modify the file: {e}")

    def close(self):
        self.driver.close()

file_service = FileService()
atexit.register(lambda: file_service.close())