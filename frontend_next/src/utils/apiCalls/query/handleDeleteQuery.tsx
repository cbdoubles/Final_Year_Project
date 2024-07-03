import { QueryType, FolderType } from "@/src/libs/types";

/**
 * Handle query deletion
 *
 * @description
 * This function deletes a specified query from the server. It returns a boolean indicating
 * whether the deletion was successful or not.
 *
 * @param {QueryType | null} deletingQuery - The query to be deleted.
 * @param {FolderType} folderType - The type of folder the query belongs to.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if it was not.
 */
export const handleDeleteQuery = async (
  deletingQuery: QueryType | null,
  folderType: FolderType
): Promise<boolean> => {
  if (deletingQuery && folderType) {
    /**
     * Get the queries URL based on folder type
     *
     * @param {FolderType} folderType - The type of folder the query belongs to.
     * @returns {string} The URL to delete the query for the given folder type.
     */
    const getQueriesUrl = (folderType: FolderType): string => {
      return folderType === "Favorite"
        ? `http://localhost:8000/api/favorite-queries/${deletingQuery.queryId}/`
        : `http://localhost:8000/api/custom-queries/${deletingQuery.queryId}/`;
    };

    try {
      const response = await fetch(getQueriesUrl(folderType), {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      return true; // Return true if deletion was successful
    } catch (error) {
      console.error("Error deleting query:", error);
      return false; // Return false if any error occurs during deletion
    }
  }

  return false; // Return false if deletingElement is null
};
