# # import json
# # import os

# # class CypherResultParser:
# #     NODE_KEY = "outgoing_typed_relationships"
# #     EDGE_KEY = "type"

# #     def __init__(self, input_file, output_file):
# #         self.input_file = input_file
# #         self.output_file = output_file
# #         self.cols = []
# #         self.colType = {}
# #         self.nodes = []
# #         self.edges = []

# #     def parse(self):
# #         with open(self.input_file, 'r') as file:
# #             data = json.load(file)
        
# #         self.read_columns(data["columns"])
# #         self.read_result_table(data["data"])

# #         output_data = {
# #             "nodes": self.nodes,
# #             "edges": self.edges
# #         }

# #         with open(self.output_file, 'w') as file:
# #             json.dump(output_data, file, indent=4)

# #     def read_columns(self, columns):
# #         self.cols = columns
# #         for col in self.cols:
# #             self.colType[col] = "Unknown"

# #     def read_result_table(self, rows):
# #         for row in rows:
# #             for i, item in enumerate(row):
# #                 col = self.cols[i]
# #                 item_type = self.duck_type_object(item, col)

# #                 if item_type == "Node":
# #                     self.parse_node(item, col)
# #                 elif item_type == "Edge":
# #                     self.parse_edge(item, col)

# #     def parse_node(self, node, column):
# #         node_id = node["self"]
# #         node_data = node["data"]
# #         node_metadata = node.get("metadata", {})

# #         parsed_node = {
# #             "id": node_id,
# #             "data": node_data,
# #             "metadata": node_metadata
# #         }

# #         self.nodes.append(parsed_node)

# #     def parse_edge(self, edge, column):
# #         edge_id = edge["self"]
# #         start_node = edge["start"]
# #         end_node = edge["end"]
# #         edge_type = edge["type"]
# #         edge_data = edge["data"]

# #         parsed_edge = {
# #             "id": edge_id,
# #             "source": start_node,
# #             "target": end_node,
# #             "type": edge_type,
# #             "data": edge_data
# #         }

# #         self.edges.append(parsed_edge)

# #     def duck_type_object(self, obj, column):
# #         if self.is_node_type(obj):
# #             return "Node"
# #         elif self.is_edge_type(obj):
# #             return "Edge"
# #         else:
# #             return "Ignore"

# #     def is_node_type(self, obj):
# #         return self.NODE_KEY in obj

# #     def is_edge_type(self, obj):
# #         return self.EDGE_KEY in obj

# # def main():
# #     input_file = 'backend\input-data.json'
# #     output_file = 'cytoscape_compatible.json'

# #     parser = CypherResultParser(input_file, output_file)
# #     parser.parse()
# #     print(f'Parsed data saved to {output_file}')

# # if __name__ == "__main__":
# #     main()


# # import json
# # import os

# # class CypherResultParser:
# #     def __init__(self, input_file, output_file):
# #         self.input_file = input_file
# #         self.output_file = output_file
# #         self.nodes = []
# #         self.edges = []

# #     def parse(self):
# #         with open(self.input_file, 'r') as file:
# #             data = json.load(file)
        
# #         self.process_data(data)

# #         output_data = {
# #             "nodes": self.nodes,
# #             "edges": self.edges
# #         }

# #         with open(self.output_file, 'w') as file:
# #             json.dump(output_data, file, indent=4)

# #     def process_data(self, data):
# #         for record in data:
# #             for field in record['_fields']:
# #                 if 'labels' in field:
# #                     self.parse_node(field)
# #                 elif 'type' in field:
# #                     self.parse_edge(field)

# #     def parse_node(self, node):
# #         node_id = node["elementId"]
# #         node_data = node["properties"]

# #         parsed_node = {
# #             "data": {
# #                 "id": node_id,
# #                 **node_data
# #             }
# #         }

# #         self.nodes.append(parsed_node)

# #     def parse_edge(self, edge):
# #         edge_id = edge["elementId"]
# #         start_node = edge["start"]
# #         end_node = edge["end"]
# #         edge_type = edge["type"]
# #         edge_data = edge["properties"]

# #         parsed_edge = {
# #             "data": {
# #                 "id": edge_id,
# #                 "source": start_node,
# #                 "target": end_node,
# #                 "interaction": edge_type,
# #                 **edge_data
# #             }
# #         }

# #         self.edges.append(parsed_edge)

# # def main():
# #     input_file = os.path.join(os.path.dirname(__file__), 'input-data.json')
# #     output_file = os.path.join(os.path.dirname(__file__), 'cytoscape_compatible.json')

# #     parser = CypherResultParser(input_file, output_file)
# #     parser.parse()
# #     print(f'Parsed data saved to {output_file}')

# # if __name__ == "__main__":
# #     main()


# import json
# import os

# class CypherResultParser:
#     def __init__(self, input_file, output_file):
#         self.input_file = input_file
#         self.output_file = output_file
#         self.nodes = []
#         self.edges = []

#     def parse(self):
#         with open(self.input_file, 'r') as file:
#             data = json.load(file)
        
#         self.process_data(data)

#         output_data = {
#             "elements": {
#                 "nodes": self.nodes,
#                 "edges": self.edges
#             }
#         }

#         with open(self.output_file, 'w') as file:
#             json.dump(output_data, file, indent=4)

#     def process_data(self, data):
#         for record in data:
#             for field in record['_fields']:
#                 if 'labels' in field:
#                     self.parse_node(field)
#                 elif 'type' in field:
#                     self.parse_edge(field)

#     def parse_node(self, node):
#         node_id = node["elementId"]
#         node_data = node["properties"]

#         parsed_node = {
#             "data": {
#                 "id": node_id,
#                 **node_data
#             }
#         }

#         self.nodes.append(parsed_node)

#     def parse_edge(self, edge):
#         edge_id = edge["elementId"]
#         start_node = edge["start"]
#         end_node = edge["end"]
#         edge_type = edge["type"]
#         edge_data = edge["properties"]

#         parsed_edge = {
#             "data": {
#                 "id": edge_id,
#                 "source": start_node,
#                 "target": end_node,
#                 "interaction": edge_type,
#                 **edge_data
#             }
#         }

#         self.edges.append(parsed_edge)

# def main():
#     input_file = os.path.join(os.path.dirname(__file__), 'input-data.json')
#     output_file = os.path.join(os.path.dirname(__file__), 'cytoscape_compatible.json')

#     parser = CypherResultParser(input_file, output_file)
#     parser.parse()
#     print(f'Parsed data saved to {output_file}')

# if __name__ == "__main__":
#     main()


import json
import os

class CypherResultParser:
    def __init__(self, input_file, output_file):
        self.input_file = input_file
        self.output_file = output_file
        self.nodes = []
        self.edges = []

    def parse(self):
        with open(self.input_file, 'r') as file:
            data = json.load(file)
        
        self.process_data(data)

        output_data = {
            "elements": {
                "nodes": self.nodes,
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

        self.nodes.append(parsed_node)

    def parse_edge(self, edge):
        edge_id = edge["elementId"]
        start_node = edge["startNodeElementId"]
        end_node = edge["endNodeElementId"]
        edge_type = edge["type"]
        edge_data = edge["properties"]

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
