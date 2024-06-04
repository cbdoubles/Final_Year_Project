import json
import os

class CypherResultParser:
    def __init__(self, input_file, output_file):
        self.input_file = input_file
        self.output_file = output_file
        self.nodes = {}
        self.edges = []

    def parse(self):
        with open(self.input_file, 'r') as file:
            data = json.load(file)
        
        self.process_data(data)

        output_data = {
            "elements": {
                "nodes": list(self.nodes.values()),
                "edges": self.edges
            }
        }

        with open(self.output_file, 'w') as file:
            json.dump(output_data, file, indent=4)

    def process_data(self, data):
        for record in data:
            for field in record['_fields']:
                if isinstance(field, dict) and 'labels' in field:
                    self.parse_node(field)
                elif isinstance(field, list):
                    for edge in field:
                        self.parse_edge(edge)

    def parse_node(self, node):
        node_id = node["elementId"]
        node_data = node["properties"]

        parsed_node = {
            "data": {
                "id": node_id,
                **node_data
            }
        }

        self.nodes[node_id] = parsed_node

    def parse_edge(self, edge):
        edge_id = edge["elementId"]
        start_node = edge["startNodeElementId"]
        end_node = edge["endNodeElementId"]
        edge_type = edge["type"]
        edge_data = edge["properties"]

        # Ensure both start and end nodes exist before adding the edge
        if start_node in self.nodes and end_node in self.nodes:
            parsed_edge = {
                "data": {
                    "id": edge_id,
                    "source": start_node,
                    "target": end_node,
                    "interaction": edge_type,
                    **edge_data
                }
            }
            self.edges.append(parsed_edge)

def main():
    input_file = os.path.join(os.path.dirname(__file__), 'input-data.json')
    output_file = os.path.join(os.path.dirname(__file__), 'cytoscape_compatible.json')

    parser = CypherResultParser(input_file, output_file)
    parser.parse()
    print(f'Parsed data saved to {output_file}')

if __name__ == "__main__":
    main()
