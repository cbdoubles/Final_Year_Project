import { FolderType, QueryType } from "@/src/libs/types";
import { toast } from "react-toastify";

export const handleEditQuery = async (
  editingQuery: QueryType,
  folderType: FolderType
): Promise<boolean> => {
  if (editingQuery && folderType) {
    const getQueriesUrl = (folderType: FolderType): string => {
      return folderType === "Favorite"
        ? `http://localhost:8000/api/favorite-queries/?id=${editingQuery.queryId}`
        : `http://localhost:8000/api/custom-queries/?id=${editingQuery.queryId}`;
    };

    try {
      const formData = new FormData();
      formData.append("id", String(editingQuery.queryId));
      formData.append("name", editingQuery.queryName);
      formData.append("cypher_query", editingQuery.cypherQuery);
      formData.append("natural_language_query", editingQuery.natLang);

      // const response = await fetch(
      //   `http://localhost:8000/api/folders/${folder.folderId}/`,
      //   {
      //     method: "PATCH",
      //     body: formData,
      //   }
      // );

      const response = await fetch(getQueriesUrl(folderType), {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      console.log("edited query in backend");

      return true; // Return true if deletion was successful
    } catch (error) {
      console.error("Error editing query:", error);
      toast.error("Name already in use");
      return false; // Return false if any error occurs during deletion
    }
  }

  return false; // Return false if editingElement is null
};
