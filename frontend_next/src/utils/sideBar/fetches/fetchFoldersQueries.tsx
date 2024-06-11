import {
  ProjectType,
  QueryFolderType,
  QueryFolderTypeFetch,
  QueryType,
  QueryTypeFetch,
  QueryFolderListType,
} from "@/src/libs/types";
import { combineFoldersAndQueries } from "@/utils/sideBar/FolderQueryListConverter";
import { useProjectProps } from "@/src/contexts/ProjectContext";

export const fetchFoldersQueries = async (
  folderType: "Default" | "Custom" | "Favorite",
  projectId: string
): Promise<QueryFolderListType[]> => {
  // const { projectId } = useProjectProps();

  try {
    // const formData = new FormData();
    // formData.append("projectId", projectId);
    // formData.append("type", folder);
    console.log(projectId);

    const response = await fetch(
      `http://localhost:8000/api/folders/folders_with_queries/?project=${projectId}&type=${folderType}`,
      {
        ///need to change this
        method: "GET",
        // body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch elements");
    }

    const data: [QueryFolderTypeFetch[], QueryTypeFetch[]] =
      await response.json();

    console.log("printing data");
    console.log(data);

    const folders: QueryFolderType[] = data[0].map((folder) => ({
      folderId: folder.id,
      folderName: folder.name,
    }));

    const queries: QueryType[] = data[1].map((query) => ({
      queryId: query.id,
      folderId: query.folder,
      queryName: query.name,
      cypherQuery: query.cypher_query,
      natLang: query.natural_language_query,
      projectId: query.project,
    }));

    const queryFolderList: QueryFolderListType[] = combineFoldersAndQueries(
      folders,
      queries
    );

    return queryFolderList;
  } catch (error) {
    console.error("Error fetching elements:", error);
    throw error;
  }
};
