from neo4j import GraphDatabase

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
            return [record for record in result]
    
    def modify_query(self, query):
        lower_query = query.lower()
        
        return_pos = lower_query.find("return")
        
        if return_pos != -1:
            after_return = query[return_pos + 6:]
            if "r" in after_return:
                return query
        modified_query = query + ",r" 
        return modified_query
    
    def query_graph(self, nodes, edges, query):
        # Convert the nodes and edges to a format that can be used in a Cypher query
        query = self.modify_query(query)
        nodes_param = [{**node} for node in nodes]
        edges_param = [{**edge} for edge in edges]

        with self.driver.session() as session:
        # Run the provided query with the nodes and edges as parameters
            result = session.run(query, {"nodes": nodes_param, "edges": edges_param})

        # Process the result
        # 3 cases return one or many nodes, return relationship of edges, return everything
        
            #kkk 

        return {"nodes": nodes_param, "edges": edges_param}