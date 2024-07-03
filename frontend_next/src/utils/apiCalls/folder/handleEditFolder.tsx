import { toast } from "react-toastify";

import { QueryFolderType } from "@/src/libs/types";

/**
 * Handle folder editing
 *
 * @description
 * This function updates the name of a specified folder on the server. If the update fails, it returns the previous state of the folder.
 *
 * @param {QueryFolderType} folder - The folder object with updated information.
 * @param {QueryFolderType} prevElementState - The previous state of the folder before the update.
 * @returns {Promise<QueryFolderType>} A promise that resolves to the updated folder object if the update is successful, or the previous state if it fails.
 */
export const handleEditFolder = async (
  folder: QueryFolderType,
  prevElementState: QueryFolderType
): Promise<QueryFolderType> => {
  try {
    const formData = new FormData();
    formData.append("name", folder.folderName);

    const response = await fetch(
      `http://localhost:8000/api/folders/${folder.folderId}/`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error");
    } else {
      return folder;
    }
  } catch (error) {
    console.error("Error updating project name:", error);
    toast.error("Name already in use");
    return prevElementState;
  }
};
