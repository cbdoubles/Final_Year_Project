import { toast } from "react-toastify";

import { QueryFolderType, FolderType } from "@/src/libs/types";
import { DB_URL } from "@/src/libs/constants";

/**
 * Handle folder saving
 *
 * @description
 * This function creates a new folder on the server. It returns the created folder object if successful,
 * or null if an error occurs.
 *
 * @param {string} folderName - The name of the folder to be created.
 * @param {FolderType} folderType - The type of the folder to be created.
 * @param {number} projectId - The ID of the project the folder belongs to.
 * @returns {Promise<QueryFolderType | null>} A promise that resolves to the created folder object if successful, or null if an error occurs.
 */
export const handleSaveFolder = async (
  foldeName: string,
  folderType: FolderType,
  projectId: number
): Promise<QueryFolderType | null> => {
  try {
    const response = await fetch(`${DB_URL}/api/folders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project: projectId,
        name: foldeName,
        type: folderType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error");
    }

    const responseData = await response.json();
    const newFolder: QueryFolderType = {
      folderId: responseData.id,
      folderName: responseData.name,
      folderType: responseData.type,
    };

    return newFolder; // Return true if update was successful
  } catch (error) {
    console.error("Error saving folder:", error);
    toast.error("Folder name already in use");
    return null; // Return false if any error occurs during update
  }
};
