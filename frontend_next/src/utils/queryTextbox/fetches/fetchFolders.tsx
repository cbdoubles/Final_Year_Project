import { FolderType, QueryFolderType } from "@/src/libs/types";

export const fetchFolders = async (
  projectId: number,
  folderType: FolderType
): Promise<QueryFolderType[] | null> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/folders/by-project/?project=${projectId}&type=${folderType}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const folders = await response.json();
    console.log("print folders after call");
    console.log(folders);

    // Transform the data if necessary
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
