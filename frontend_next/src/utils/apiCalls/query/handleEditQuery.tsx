import { toast } from "react-toastify";

import { FolderType, QueryType } from "@/src/libs/types";
import { DB_URL } from "@/src/libs/constants";

/**
 * Handle query editing
 *
 * @description
 * This function updates the details of a specified query on the server. It returns a boolean indicating
 * whether the update was successful or not.
 *
 * @param {QueryType} editingQuery - The query object with updated information.
 * @param {FolderType} folderType - The type of folder the query belongs to.
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful, or false if it was not.
 */
export const handleEditQuery = async (
  editingQuery: QueryType,
  folderType: FolderType
): Promise<boolean> => {
  if (editingQuery && folderType) {
    /**
     * Get the queries URL based on folder type
     *
     * @param {FolderType} folderType - The type of folder the query belongs to.
     * @returns {string} The URL to update the query for the given folder type.
     */
    const getQueriesUrl = (folderType: FolderType): string => {
      return folderType === "Favorite"
        ? `${DB_URL}/api/favorite-queries/${editingQuery.queryId}/`
        : `${DB_URL}/api/custom-queries/${editingQuery.queryId}/`;
    };

    try {
      const response = await fetch(getQueriesUrl(folderType), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingQuery.queryId,
          name: editingQuery.queryName,
          cypher_query: editingQuery.cypherQuery,
          natural_language_query: editingQuery.natLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      return true; // Return true if update was successful
    } catch (error) {
      console.error("Error editing query:", error);
      toast.error("Name already in use");
      return false; // Return false if any error occurs during update
    }
  }

  return false; // Return false if editingQuery or folderType is null
};
