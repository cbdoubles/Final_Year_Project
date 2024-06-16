import { FolderType, QueryFolderListType, QueryType } from "@/src/libs/types";

export const fetchFoldersQueries = async (
  selectedFolderType: FolderType,
  projectId: number
): Promise<QueryFolderListType[]> => {
  try {
    // Fetch the list of folders
    console.log(projectId);
    console.log(selectedFolderType);
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
