import { QueryFolderType } from "@/src/libs/types";

export const handleDeleteFolder = async (
  deletingfolder: QueryFolderType | null
): Promise<boolean> => {
  if (deletingfolder) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/folders/${deletingfolder.folderId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      console.log("deleted in backend");

      return true; // Return true if deletion was successful
    } catch (error) {
      console.error("Error deleting element:", error);
      return false; // Return false if any error occurs during deletion
    }
  }

  return false; // Return false if deletingElement is null
};
