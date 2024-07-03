import { FolderType, QueryFolderListType, QueryType } from "@/src/libs/types";

/**
 * Fetch folders and their queries
 *
 * @description
 * This function fetches folders for a given project ID and folder type, then fetches the queries for each folder.
 * It returns a list of QueryFolderListType objects, each containing a folder and its associated queries.
 *
 * @param {FolderType} selectedFolderType - The type of folders to fetch.
 * @param {number} projectId - The ID of the project to fetch folders and queries for.
 * @returns {Promise<QueryFolderListType[]>} A promise that resolves to a list of QueryFolderListType objects.
 */
export const fetchFoldersQueries = async (
  selectedFolderType: FolderType,
  projectId: number
): Promise<QueryFolderListType[]> => {
  try {
    const folderResponse = await fetch(
      `http://localhost:8000/api/folders/by-project/?project=${projectId}&type=${selectedFolderType}`,
      {
        method: "GET",
      }
    );

    if (!folderResponse.ok) {
      throw new Error(`Failed to fetch folders: ${folderResponse.statusText}`);
    }

    const folders = await folderResponse.json();

    // Initialize the list to store QueryFolderListType objects
    const queryFolderList: QueryFolderListType[] = [];

    /**
     * Get the queries URL based on folder type
     *
     * @param {number} folderId - The ID of the folder.
     * @returns {string} The URL to fetch queries for the given folder ID.
     */
    const getQueriesUrl = (folderId: number): string => {
      return selectedFolderType === "Favorite"
        ? `http://localhost:8000/api/favorite-queries/by-folder/?folder_id=${folderId}`
        : `http://localhost:8000/api/custom-queries/by-folder/?folder_id=${folderId}`;
    };

    // Iterate through each folder to fetch its queries
    for (const folder of folders) {
      const folderId = folder.id;
      const folderName = folder.name;
      const folderType = folder.type;

      // Fetch the queries for the current folder
      const queriesResponse = await fetch(getQueriesUrl(folderId), {
        method: "GET",
      });

      if (!queriesResponse.ok) {
        throw new Error(
          `Failed to fetch queries for folder ${folderId}: ${queriesResponse.statusText}`
        );
      }

      const queriesData = await queriesResponse.json();
      const queries: QueryType[] = queriesData.map((query: any) => ({
        queryId: query.id,
        folderId: query.folder,
        queryName: query.name,
        cypherQuery: query.cypher_query,
        natLang: query.natural_language_query,
      }));

      // Add the folder and its queries to the list
      queryFolderList.push({
        folder: {
          folderId: folderId,
          folderName: folderName,
          folderType: folderType,
        },
        queries: queries,
      });
    }

    // Return the list of QueryFolderListType objects
    return queryFolderList;
  } catch (error) {
    console.error("Error fetching query folders:", error);
    throw error;
  }
};
