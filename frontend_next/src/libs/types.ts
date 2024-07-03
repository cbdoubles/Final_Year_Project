// Defines the type for different folder types, which can be either "Default", "Custom", "Favorite" or null.
export type FolderType = "Default" | "Custom" | "Favorite" | null;

// Represents an element with project-related information.
export type Element = {
  projectId: number;
  projectName: string;
  graphName: string;
};

// Defines the structure of a project type when fetched from both backend (be) and frontend (fe).
export type ProjectTypeFetch = {
  id: number;
  name: string;
  file_name: string;
};

// Defines the structure of a project type used within the application.
export type ProjectType = {
  projectId: number;
  projectName: string;
  graphName: string;
};

// Represents the structure of a query folder type when fetched from backend and frontend.
export type QueryFolderType = {
  folderId: number;
  folderName: string;
  folderType: FolderType;
};

// Represents the structure of a query type used within the application.
export type QueryType = {
  queryId: number;
  queryName: string;
  cypherQuery: string;
  natLang: string;
  clicked?: boolean;
};

// Represents the structure of a query folder type when fetched from backend.
export type QueryFolderTypeFetch = {
  id: number;
  name: string;
  project: number;
  type: string;
};

// Represents the structure of a query type when fetched from backend.
export type QueryTypeFetch = {
  id: number;
  folder: number;
  name: string;
  cypher_query: string;
  natural_language_query: string;
  project: number;
};

// Represents the structure for organizing queries into their respective folders.
export type QueryFolderListType = {
  folder: QueryFolderType;
  queries: QueryType[];
};
