from neo4j import GraphDatabase
import sys

#run with python print_example.py <username> <password>

def retrieve_nodes():
    if len(sys.argv) < 3:
        print("Usage: python upload_file.py <username> <password> <file_path>")
        sys.exit(1)

    # Connect to Neo4j
    uri = "bolt://localhost:7687"
    user = sys.argv[1]
    password = sys.argv[2]

    # Connect to Neo4j
    driver = GraphDatabase.driver(uri, auth=(user, password))
    
    nodes = []
    
    # Define a Cypher query to retrieve all nodes
    cypher_query = "MATCH (n) RETURN n"
    
    with driver.session() as session:
        result = session.run(cypher_query)
        for record in result:
            nodes.append(record['n'].items())  # Append node properties as dictionary
            
    return nodes

if __name__ == "__main__":
    nodes = retrieve_nodes()

    # nodes is a list of dictionaries, each representing a node
    for node in nodes:
        print(node)  # Print each node
