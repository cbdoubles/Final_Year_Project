from neo4j import GraphDatabase

uri = "bolt://localhost:7687"
user = "neo4j"
password = "password3"
class Neo4jService:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def run_query(self, query):
        with self.driver.session() as session:
            result = session.run(query)
            return [record for record in result]
        
    def modify_query(query):
        lower_query = query.lower()
        
        return_pos = lower_query.find("return")
        
        if return_pos != -1:
            after_return = query[return_pos + 6:]
            if "r" in after_return:
                return query
        modified_query = query[:-2] + "r" + query[-2:]
        return modified_query
    
    def query_graph(self, nodes, edges, query):
        # Convert the nodes and edges to a format that can be used in a Cypher query
        query = self.modify_query(query)
        nodes_param = [{**node} for node in nodes]
        edges_param = [{**edge} for edge in edges]

        new_nodes = []
        new_edges = []

        with self.driver.session() as session:
        # Run the provided query with the nodes and edges as parameters
            result = session.run(query, {"nodes": nodes_param, "edges": edges_param})

        # Process the result
        
            for record in result:
                if 'nodes' in record.keys():
                   new_nodes.extend(record['nodes'])
                if 'edges' in record.keys():
                   new_edges.extend(record['edges'])

        return {"nodes": new_nodes, "edges": new_edges}