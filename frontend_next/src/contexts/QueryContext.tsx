import React, { createContext, useContext, useMemo, useState } from "react";

type FolderType = "favorite" | "custom" | "default" | "";

type QueryContextType = {
  cypherQuery: string;
  setCypherQuery: (query: string) => void;
  queryId: string;
  setQueryId: (id: string) => void;
  projectId: string;
  setProjectId: (id: string) => void;
  queryName: string;
  setQueryName: (name: string) => void;
  naturalLanguageQuery: string;
  setNaturalLanguageQuery: (text: string) => void;
  folderType: FolderType;
  setFolderType: (type: FolderType) => void;
  resetQueryContext: () => void;
};

export const QueryContext = createContext<QueryContextType>({
  cypherQuery: "MATCH (n) RETURN n LIMIT 25",
  setCypherQuery: () => {},
  queryId: "23",
  setQueryId: () => {},
  projectId: "2",
  setProjectId: () => {},
  queryName: "matching good people",
  setQueryName: () => {},
  naturalLanguageQuery:
    "Show me $howmany:int$ people in the database and limit it to 25.",
  setNaturalLanguageQuery: () => {},
  folderType: "favorite",
  setFolderType: () => {},
  resetQueryContext: () => {},
});

export const QueryPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cypherQuery, setCypherQuery] = useState<string>("");
  const [queryId, setQueryId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [queryName, setQueryName] = useState<string>("");
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>("");
  const [folderType, setFolderType] = useState<FolderType>("");

  const resetQueryContext = () => {
    setCypherQuery("");
    setQueryId("");
    setProjectId("");
    setQueryName("");
    setNaturalLanguageQuery("");
    setFolderType("");
  };

  const value = useMemo(
    () => ({
      cypherQuery,
      setCypherQuery,
      queryId,
      setQueryId,
      projectId,
      setProjectId,
      queryName,
      setQueryName,
      naturalLanguageQuery,
      setNaturalLanguageQuery,
      folderType,
      setFolderType,
      resetQueryContext,
    }),
    [
      cypherQuery,
      queryId,
      projectId,
      queryName,
      naturalLanguageQuery,
      folderType,
    ]
  );

  return (
    <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
  );
};

export const useQueryProps = () => useContext(QueryContext);
