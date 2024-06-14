import { QueryFolderType, QueryFolderTypeFetch } from "@/src/libs/types";

export const fetchFolders = async (
  setElements: React.Dispatch<React.SetStateAction<QueryFolderType[]>>,
  projectId: number,
  type: string,
) => {
  try {
    // const response = await fetch(`http://localhost:8000/api/projects/${projectId}${type}/`);
    // const data: QueryFolderTypeFetch[] = await response.json();

    // // Transform data from ProjectType[] to Element[]
    // const transformedData: QueryFolderType[] = data.map((folder) => ({
    //   folderId: folder.id,
    //   folderName: folder.name,
    // }));
    const folders: QueryFolderType[] = [
      { folderId: 1, folderName: "Folder 1" },
      { folderId: 2, folderName: "Folder 2" },
    ];

    setElements(folders);
  } catch (error) {
    console.error("Error fetching elements:", error);
  }
};
