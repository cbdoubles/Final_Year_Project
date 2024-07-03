import { QueryFolderType } from "@/src/libs/types";

/**
 * Handle folder deletion
 *
 * @description
 * This function deletes a specified folder from the server. It returns a boolean indicating
 * whether the deletion was successful or not.
 *
 * @param {QueryFolderType | null} deletingFolder - The folder to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false if it was not.
 */
export const handleDeleteFolder = async (
  deletingFolder: QueryFolderType | null
): Promise<boolean> => {
  if (deletingFolder) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/folders/${deletingFolder.folderId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      return true; // Return true if deletion was successful
    } catch (error) {
      console.error("Error deleting folder:", error);
      return false; // Return false if any error occurs during deletion
    }
  }

  return false; // Return false if deletingFolder is null
};
