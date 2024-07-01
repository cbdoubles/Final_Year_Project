import { FolderType, QueryType } from "@/src/libs/types";
import { toast } from "react-toastify";

export const handleEditQuery = async (
  editingQuery: QueryType,
  folderType: FolderType
): Promise<boolean> => {
  if (editingQuery && folderType) {
    const getQueriesUrl = (folderType: FolderType): string => {
      return folderType === "Favorite"
        ? `http://localhost:8000/api/favorite-queries/${editingQuery.queryId}/`
        : `http://localhost:8000/api/custom-queries/${editingQuery.queryId}/`;
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
      console.log("Edited query in backend");

      return true; // Return true if update was successful
    } catch (error) {
      console.error("Error editing query:", error);
      toast.error("Name already in use");
      return false; // Return false if any error occurs during update
    }
  }

  return false; // Return false if editingQuery or folderType is null
};
