import { QueryFolderType, FolderType, QueryType } from "@/src/libs/types";
import { toast } from "react-toastify";

export const handleSaveQuery = async (
  queryName: string,
  cyphertext: string,
  natLang: string,
  folder: QueryFolderType,
  projectId: number
): Promise<QueryType | null> => {
  if (folder.folderType) {
    const getQueriesUrl = (folder: FolderType): string => {
      return folder === "Favorite"
        ? `http://localhost:8000/api/favorite-queries/`
        : `http://localhost:8000/api/custom-queries/`;
    };

    try {
      const response = await fetch(getQueriesUrl(folder.folderType), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: projectId,
          folder: folder.folderId,
          name: queryName,
          cypher_query: cyphertext,
          natural_language_query: natLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      console.log("Edited query in backend");
      console.log(response);

      const responseData = await response.json();
      const newQuery: QueryType = {
        queryId: responseData.id,
        queryName: responseData.name,
        cypherQuery: responseData.cypher_query,
        natLang: responseData.natural_language_query,
      };
      console.log("newquery in handlesave");
      console.log(newQuery);

      return newQuery; // Return true if update was successful
    } catch (error) {
      console.error("Error editing query:", error);
      toast.error("Invalid Query name (possible duplicate or empty)");
      return null; // Return false if any error occurs during update
    }
  }
  return null;
};
