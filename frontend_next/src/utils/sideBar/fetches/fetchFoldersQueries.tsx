import {
  QueryFolderListType,
} from "@/src/libs/types";
import { combineFoldersAndQueries } from "@/utils/sideBar/FolderQueryListConverter";
import { useProjectProps } from "@/src/contexts/ProjectContext";

export const fetchFoldersQueries = async (
  folderType: "Default" | "Custom" | "Favorite",
  projectId: number
): Promise<QueryFolderListType[]> => {
  const transformData = (data: any[]): QueryFolderListType[] => {
    return data.map((folder) => ({
      folder: {
        folderId: folder.id,
        folderName: folder.name,
      },
      queries: folder.queries.map((query: any) => ({
        queryId: query.id,
        folderId: query.folder,
        queryName: query.name,
        cypherQuery: query.cypher_query,
        natLang: query.natural_language_query,
      })),
    }));
  };

  console.log("just about to url call");

  try {
    // const formData = new FormData();
    // formData.append("projectId", projectId);
    // formData.append("type", folder);
    // console.log(projectId);

    const response = await fetch(
      `http://localhost:8000/api/folders/folders-with-queries/?project=42&type=Custom`,
      {
        ///need to change this
        method: "GET",
        // body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch elements");
    }

    const data: [any] = await response.json();

    const queryFolderList: QueryFolderListType[] = transformData(data);

    return queryFolderList;
  } catch (error) {
    console.error("Error fetching elements:", error);
    throw error;
  }
};
