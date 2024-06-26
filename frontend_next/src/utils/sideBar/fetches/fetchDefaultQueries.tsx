import { QueryType } from "@/src/libs/types";

export const fetchDefaultQueries = async (): Promise<QueryType[]> => {
  try {
    const response = await fetch("http://localhost:8000/api/default-queries/");
    const data = await response.json();

    const transformedData: QueryType[] = data.map((query: any) => ({
      queryId: query.id,
      queryName: query.name,
      cypherQuery: query.cypher_query,
      natLang: query.natural_language_query,
    }));

    if (!response.ok) {
      throw new Error(`Failed to fetch folders: ${response.statusText}`);
    }

    return transformedData;
  } catch (error) {
    console.error("Error fetching default queries:", error);
    throw error;
  }
};
