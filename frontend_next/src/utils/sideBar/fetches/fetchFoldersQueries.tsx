import {
  FolderType,
  QueryFolderType,
  QueryFolderTypeFetch,
  QueryType,
  QueryTypeFetch,
  QueryFolderListType,
} from "@/src/libs/types";
import { combineFoldersAndQueries } from "@/utils/sideBar/FolderQueryListConverter";
import { useProjectProps } from "@/src/contexts/ProjectContext";

export const fetchFoldersQueries = async (
  folder: FolderType
): Promise<QueryFolderListType[]> => {
  const { projectId } = useProjectProps();

  try {
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("type", folder.type);

    const response = await fetch("http://localhost:8000/api/projects/", {
      ///need to change this
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch elements");
    }

    const data: [QueryFolderTypeFetch[], QueryTypeFetch[]] =
      await response.json();

    const folders: QueryFolderType[] = data[0].map((folder) => ({
      folderId: folder.folderId,
      folderName: folder.folderName,
    }));

    const queries: QueryType[] = data[1].map((query) => ({
      queryId: query.queryId,
      folderId: query.folderId,
      queryName: query.queryName,
      cypherQuery: query.cypherQuery,
      natLang: query.natLang,
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
