import { QueryFolderType } from "@/src/libs/types";

export const handleDeleteFolder = async (
  deletingFolder: QueryFolderType | null
): Promise<boolean> => {
  if (deletingFolder) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/folders/${deletingFolder.folderId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      console.log("Deleted folder and associated objects in backend");

      return true; // Return true if deletion was successful
    } catch (error) {
      console.error("Error deleting folder:", error);
      return false; // Return false if any error occurs during deletion
    }
  }

  return false; // Return false if deletingFolder is null
};
