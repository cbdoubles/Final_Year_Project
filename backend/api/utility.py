import re


def wrap_query_with_apoc(cypher_query):
    # Helper function to wrap subqueries with APOC
    def wrap_subquery(subquery):
        return f"CALL {{ {subquery.strip()} RETURN collect(n) AS nodes, collect(r) AS edges }}"

    # Recursive function to process queries with UNION / UNION ALL
    def process_query(query):
        # Check if the query contain UNION / UNION ALL
        union_match = re.search(
            r"\s+UNION\s+|\s+UNION ALL\s+", query, flags=re.IGNORECASE)

        if union_match:
            # Split the query into subqueries with the UNION / UNION ALL as pivot
            subqueries = re.split(
                r"(\s+UNION\s+|\s+UNION ALL\s+)", query, flags=re.IGNORECASE)

            # Recursively process each subquery and wrap with APOC
            processed_subqueries = [wrap_subquery(subquery) if i % 2 == 0 else subquery.strip(
            ) for i, subquery in enumerate(subqueries)]

            # Combine the processed subqueries
            combined_query = ' '.join(processed_subqueries)
            final_query = f"CALL {{ {combined_query} }} RETURN nodes, edges"

        else:
            # For queries without UNION / UNION ALL, wrap the single query with APOC
            final_query = wrap_subquery(query) + "RETURN nodes, edges"

        return final_query

    # Process and return the main query
    return process_query(cypher_query.strip())

if __name__ == '__main__':
    query = "MATCH (n:Person)-[r:KNOWS]->(m:Person) RETURN n, r, m"
    print(wrap_query_with_apoc(query))  
    query_2 = "MATCH (n:Person) RETURN n UNION ALL MATCH (m:Movie) RETURN m UNION MATCH (d:Director) RETURN d"
    print(f"\n{wrap_query_with_apoc(query_2)}")

    cypher_query = """
    MATCH (a)-[r]->(b) 
    RETURN a, r, b 
    LIMIT 10 
    UNION ALL 
    MATCH (c)-[s]->(d) 
    RETURN c, s, d 
    LIMIT 10
    """
    print(f"\n{wrap_query_with_apoc(cypher_query)}")
