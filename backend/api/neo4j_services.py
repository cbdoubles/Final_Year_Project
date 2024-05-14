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
    
    def query_graph(self, query):
        # Convert the nodes and edges to a format that can be used in a Cypher query
        query = self.modify_query(query)

        # Regular expression to match everything after 'RETURN '
        match = re.search('RETURN (.*)', query, re.IGNORECASE)
        if match:
            # Split the matched string by commas to get the variables
            variables = match.group(1).split(',')
            # Strip whitespace from each variable
            variables = [var.strip() for var in variables]

        print(list(variables))

        nodes = []
        edges = []

        with self.driver.session() as session:
        # Run the provided query with the nodes and edges as parameters
            result = session.run(query)
            #print(list([record for record in result]))
            for record in result:
                #print(list(record.keys()))
                for var in variables:
                    #print(list(record.keys()))
                    if var in record.keys():
                # Check the type of the variable in the Record
                        #print(list(record['r']))           
                        if str(record[var]).startswith('<Node'):
                            nodes.append(record[var])
                        elif str(record[var]).startswith('<Relationship'):
                            edges.append(record[var])

            
        return [nodes, edges]
            #print(result)
            #result.consume()

        # Process the result
        # 3 cases return one or many nodes, return relationship of edges, return everything
        
            #kkk 
