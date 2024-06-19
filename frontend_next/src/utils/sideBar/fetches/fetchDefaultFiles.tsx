import { DefaultQueryFetch, DefaultQuery } from "@/src/libs/types";

export const fetchDefaultQueries = async (): Promise<DefaultQuery[] | void> => {
  try {
    const response = await fetch("http://localhost:8000/api/default-queries/");
    const data: DefaultQueryFetch[] = await response.json();

    const transformedData: DefaultQuery[] = data.map((query) => ({
      queryId: query.id,
      queryName: query.name,
      cypherQuery: query.cypher_query,
      naturalLanguageQuery: query.natural_language_query,
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching default queries:", error);
  }
};
