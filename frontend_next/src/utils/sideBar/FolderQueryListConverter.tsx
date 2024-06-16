//////////////
//////////////
//////////////
//Don't use anymore

import {
  QueryFolderType,
  QueryType,
  QueryFolderListType,
} from "@/src/libs/types";

// Function to convert two lists into one list of QueryFolderListType
export function combineFoldersAndQueries(
  folders: QueryFolderType[],
  queries: QueryType[]
): QueryFolderListType[] {
  return folders.map((folder) => {
    const folderQueries = queries.filter(
      (query) => query.folderId === folder.folderId
    );
    return {
      folder,
      queries: folderQueries,
    };
  });
}
