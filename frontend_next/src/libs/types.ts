// types.ts

export type FolderType = {
  type: "Default" | "Custom" | "Favorite";
};

//element (to be replaced by ProjectType at some point)

export type Element = {
  projectId: string;
  projectName: string;
};

//Project type for fetch from be and fe
export type ProjectTypeFetch = {
  id: string;
  name: string;
};

export type ProjectType = {
  projectId: string;
  projectName: string;
};

//QueryFolderType and QueryType for fetch from be and fe
export type QueryFolderType = {
  folderId: number;
  folderName: string;
};

export type QueryType = {
  queryId: number;
  folderId: number;
  queryName: string;
  cypherQuery: string;
  natLang: string;
};

export type QueryFolderTypeFetch = {
  id: number;
  name: string;
  project: number;
  type: string;
};

export type QueryTypeFetch = {
  id: number;
  folder: number;
  name: string;
  cypher_query: string;
  natural_language_query: string;
  project: number;
};

//For putting queries and folders into needed structure
export type QueryFolderListType = {
  folder: QueryFolderType;
  queries: QueryType[];
};
