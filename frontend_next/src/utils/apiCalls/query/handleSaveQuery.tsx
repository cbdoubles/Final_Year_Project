import { toast } from "react-toastify";

import { QueryFolderType, FolderType, QueryType } from "@/src/libs/types";

/**
 * Handle query saving
 *
 * @description
 * This function saves a new query to the server. It returns the created query object if successful,
 * or null if an error occurs.
 *
 * @param {string} queryName - The name of the query to be saved.
 * @param {string} cyphertext - The cypher query to be saved.
 * @param {string} natLang - The natural language representation of the query.
 * @param {QueryFolderType} folder - The folder where the query will be saved.
 * @param {number} projectId - The ID of the project the query belongs to.
 * @returns {Promise<QueryType | null>} A promise that resolves to the created query object if successful, or null if an error occurs.
 */
export const handleSaveQuery = async (
  queryName: string,
  cyphertext: string,
  natLang: string,
  folder: QueryFolderType,
  projectId: number
): Promise<QueryType | null> => {
  if (folder.folderType) {
    /**
     * Get the queries URL based on folder type
     *
     * @param {FolderType} folder - The type of folder the query belongs to.
     * @returns {string} The URL to save the query for the given folder type.
     */
    const getQueriesUrl = (folder: FolderType): string => {
      return folder === "Favorite"
        ? `http://localhost:8000/api/favorite-queries/`
        : `http://localhost:8000/api/custom-queries/`;
    };

    try {
      const response = await fetch(getQueriesUrl(folder.folderType), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: projectId,
          folder: folder.folderId,
          name: queryName,
          cypher_query: cyphertext,
          natural_language_query: natLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      console.log("Edited query in backend");
      console.log(response);

      const responseData = await response.json();
      const newQuery: QueryType = {
        queryId: responseData.id,
        queryName: responseData.name,
        cypherQuery: responseData.cypher_query,
        natLang: responseData.natural_language_query,
      };
      console.log("newquery in handlesave");
      console.log(newQuery);

      return newQuery; // Return true if update was successful
    } catch (error) {
      console.error("Error editing query:", error);
      toast.error("Invalid Query name (possible duplicate or empty)");
      return null; // Return false if any error occurs during update
    }
  }
  return null;
};
