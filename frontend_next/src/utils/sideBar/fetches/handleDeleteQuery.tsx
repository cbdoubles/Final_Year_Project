import { QueryType, FolderType } from "@/src/libs/types";

export const handleDeleteQuery = async (
  deletingQuery: QueryType | null,
  folderType: FolderType
): Promise<boolean> => {
  if (deletingQuery && folderType) {
    const getQueriesUrl = (folderType: FolderType): string => {
      return folderType === "Favorite"
        ? `http://localhost:8000/api/favorite-queries/${deletingQuery.queryId}`
        : `http://localhost:8000/api/custom-queries/${deletingQuery.queryId}`;
    };

    try {
      const response = await fetch(getQueriesUrl(folderType), {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      console.log("deleted query in backend");

      return true; // Return true if deletion was successful
    } catch (error) {
      console.error("Error deleting query:", error);
      return false; // Return false if any error occurs during deletion
    }
  }

  return false; // Return false if deletingElement is null
};
