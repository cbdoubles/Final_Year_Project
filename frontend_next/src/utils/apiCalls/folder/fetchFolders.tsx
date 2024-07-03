import { DB_URL } from "@/src/libs/constants";
import { FolderType, QueryFolderType } from "@/src/libs/types";

/**
 * Fetch folders by project ID and folder type
 *
 * @description
 * This function fetches folders for a given project ID and folder type from the server. It returns
 * a transformed array of QueryFolderType objects or null if an error occurs.
 *
 * @param {number} projectId - The ID of the project to fetch folders for.
 * @param {FolderType} folderType - The type of folders to fetch.
 * @returns {Promise<QueryFolderType[] | null>} A promise that resolves to an array of QueryFolderType objects or null if an error occurs.
 */
export const fetchFolders = async (
  projectId: number,
  folderType: FolderType
): Promise<QueryFolderType[] | null> => {
  try {
    const response = await fetch(
      `${DB_URL}/api/folders/by-project/?project=${projectId}&type=${folderType}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const folders = await response.json();

    const transformedData: QueryFolderType[] = folders.map((folder: any) => ({
      folderId: folder.id,
      folderName: folder.name,
      folderType: folder.type,
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
};
