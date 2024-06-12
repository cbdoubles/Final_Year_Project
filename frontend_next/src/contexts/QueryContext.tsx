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
  cypherQuery: "",
  setCypherQuery: () => {},
  queryId: "",
  setQueryId: () => {},
  projectId: "",
  setProjectId: () => {},
  queryName: "",
  setQueryName: () => {},
  naturalLanguageQuery: "",
  setNaturalLanguageQuery: () => {},
  folderType: "",
  setFolderType: () => {},
  resetQueryContext: () => {},
});

export const QueryPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cypherQuery, setCypherQuery] = useState<string>(
    `MATCH (b:Book)-[:WRITTEN_BY]->(a:Author) WHERE a.name = $authorName AND b.year > $year RETURN b`
  );
  const [queryId, setQueryId] = useState<string>("23");
  const [projectId, setProjectId] = useState<string>("2");
  const [queryName, setQueryName] = useState<string>("matching good people");
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>(
    `Find books by author $authorName{author name} published after $year{year}.`
  );
  const [folderType, setFolderType] = useState<FolderType>("favorite");

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
