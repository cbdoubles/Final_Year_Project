// types.ts
export type Element = {
  projectId: string;
  projectName: string;
};

export type ProjectType = {
  projectId: string;
  ProjectName: string;
};

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

export type QueryFolderListType = {
  folder: QueryFolderType;
  queries: QueryType[];
};
