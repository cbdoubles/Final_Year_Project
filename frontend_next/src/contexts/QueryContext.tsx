import React, { createContext, useContext, useMemo, useState } from "react";
import { QueryType } from "../libs/types";

type QueryContextType = {
  cypherQuery: string;
  setCypherQuery: (query: string) => void;
  queryId: number;
  setQueryId: (id: number) => void;
  queryName: string;
  setQueryName: (name: string) => void;
  naturalLanguageQuery: string;
  setNaturalLanguageQuery: (text: string) => void;
  resetQueryContext: () => void;
  setQueryFromQuery: (query: QueryType) => void;
};

export const QueryContext = createContext<QueryContextType>({
  cypherQuery: "",
  setCypherQuery: () => {},
  queryId: 0,
  setQueryId: () => {},
  queryName: "",
  setQueryName: () => {},
  naturalLanguageQuery: "",
  setNaturalLanguageQuery: () => {},
  resetQueryContext: () => {},
  setQueryFromQuery: () => {},
});

export const QueryPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cypherQuery, setCypherQuery] = useState<string>(
    `MATCH (b:Book)-[:WRITTEN_BY]->(a:Author) WHERE a.name = $authorName AND b.year > $year RETURN b`
  );
  const [queryId, setQueryId] = useState<number>(0);
  const [queryName, setQueryName] = useState<string>("matching good people");
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>(
    `Find books by author $authorName{author name} published after $year{year}.`
  );

  const resetQueryContext = () => {
    setCypherQuery("");
    setQueryId(0);
    setQueryName("");
    setNaturalLanguageQuery("");
  };

  const setQueryFromQuery = (query: QueryType) => {
    setCypherQuery(query.cypherQuery);
    setQueryId(query.queryId);
    setQueryName(query.queryName);
    setNaturalLanguageQuery(query.natLang);
    // Assuming the folderType is derived from folderId in some way
    // You might need to map folderId to folderType if required
    // setFolderType(mapFolderIdToFolderType(query.folderId));
  };

  const value = useMemo(
    () => ({
      cypherQuery,
      setCypherQuery,
      queryId,
      setQueryId,
      queryName,
      setQueryName,
      naturalLanguageQuery,
      setNaturalLanguageQuery,
      resetQueryContext,
      setQueryFromQuery,
    }),
    [cypherQuery, queryId, queryName, naturalLanguageQuery]
  );

  return (
    <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
  );
};

export const useQueryProps = () => useContext(QueryContext);
