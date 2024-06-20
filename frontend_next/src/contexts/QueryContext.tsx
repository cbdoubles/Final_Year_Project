import React, { createContext, useContext, useMemo, useState } from "react";
import { QueryType } from "../libs/types";

type QueryContextType = {
  cypherQuery: string;
  setCypherQuery: (query: string) => void;
  queryId: number;
  setQueryId: (id: number) => void;
  queryName: string;
  setQueryName: (name: string) => void;
  natLang: string;
  setNaturalLanguageQuery: (text: string) => void;
  resetQueryContext: () => void;
  setQueryFromQuery: (query: QueryType) => void;
  getSelectedQuery: () => QueryType;
};

export const QueryContext = createContext<QueryContextType>({
  cypherQuery: "",
  setCypherQuery: () => {},
  queryId: 0,
  setQueryId: () => {},
  queryName: "",
  setQueryName: () => {},
  natLang: "",
  setNaturalLanguageQuery: () => {},
  resetQueryContext: () => {},
  setQueryFromQuery: () => {},
  getSelectedQuery: () => ({
    queryId: 0,
    queryName: "",
    cypherQuery: "",
    natLang: "",
    // You can add other properties here if needed
  }),
});

export const QueryPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cypherQuery, setCypherQuery] = useState<string>("");
  const [queryId, setQueryId] = useState<number>(0);
  const [queryName, setQueryName] = useState<string>("");
  const [natLang, setNaturalLanguageQuery] = useState<string>("");

  const resetQueryContext = () => {
    setCypherQuery("");
    setQueryId(0);
    setQueryName("");
    setNaturalLanguageQuery("");
  };

  const setQueryFromQuery = (query: QueryType) => {
    console.log("in query context");
    console.log(query);
    setCypherQuery(query.cypherQuery);
    console.log(cypherQuery);
    setQueryId(query.queryId);
    console.log(queryId);
    setQueryName(query.queryName);
    console.log(queryName);
    setNaturalLanguageQuery(query.natLang);
    console.log(natLang);
    console.log(getSelectedQuery());
    // Assuming the folderType is derived from folderId in some way
    // You might need to map folderId to folderType if required
    // setFolderType(mapFolderIdToFolderType(query.folderId));
  };

  const getSelectedQuery = (): QueryType => {
    return {
      queryId,
      queryName,
      cypherQuery,
      natLang,
    };
  };

  const value = useMemo(
    () => ({
      cypherQuery,
      setCypherQuery,
      queryId,
      setQueryId,
      queryName,
      setQueryName,
      natLang,
      setNaturalLanguageQuery,
      resetQueryContext,
      setQueryFromQuery,
      getSelectedQuery,
    }),
    [cypherQuery, queryId, queryName, natLang]
  );

  return (
    <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
  );
};

export const useQueryProps = () => useContext(QueryContext);
