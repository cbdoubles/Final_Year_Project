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
  updatedQuery: QueryType;
};

/**
 * QueryContext
 *
 * @description
 * Context object to manage query-related data such as cypherQuery, queryId, queryName, and natLang.
 */
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
  }),
  updatedQuery: {
    queryId: 0,
    queryName: "",
    cypherQuery: "",
    natLang: "",
  },
});

/**
 * QueryPropsProvider
 *
 * @description
 * Provider component that wraps the application with QueryContext, allowing components to
 * consume and update query data using the useQueryProps hook.
 *
 * @param {React.ReactNode} children - The child components wrapped by QueryPropsProvider.
 */
export const QueryPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cypherQuery, setCypherQuery] = useState<string>("");
  const [queryId, setQueryId] = useState<number>(0);
  const [queryName, setQueryName] = useState<string>("");
  const [natLang, setNaturalLanguageQuery] = useState<string>("");

  /**
   * resetQueryContext
   *
   * @description
   * Function to reset cypherQuery, queryId, queryName, and natLang to their default values.
   */
  const resetQueryContext = () => {
    setCypherQuery("");
    setQueryId(0);
    setQueryName("");
    setNaturalLanguageQuery("");
  };

  /**
   * setQueryFromQuery
   *
   * @description
   * Function to update all query data (cypherQuery, queryId, queryName, natLang) at once.
   *
   * @param {QueryType} query - The new query data containing cypherQuery, queryId, queryName, and natLang.
   */
  const setQueryFromQuery = (query: QueryType) => {
    setCypherQuery(query.cypherQuery);
    setQueryId(query.queryId);
    setQueryName(query.queryName);
    setNaturalLanguageQuery(query.natLang);
  };

  /**
   * getSelectedQuery
   *
   * @description
   * Function to get the currently selected query data.
   *
   * @returns {QueryType} - The selected query data containing cypherQuery, queryId, queryName, and natLang.
   */
  const getSelectedQuery = (): QueryType => {
    return {
      queryId,
      queryName,
      cypherQuery,
      natLang,
    };
  };

  const updatedQuery = useMemo(
    () => ({
      queryId,
      queryName,
      cypherQuery,
      natLang,
    }),
    [queryId, queryName, cypherQuery, natLang]
  );

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
      updatedQuery,
    }),
    [cypherQuery, queryId, queryName, natLang, updatedQuery]
  );

  return (
    <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
  );
};

/**
 * useQueryProps
 *
 * @description
 * Hook to consume the QueryContext values across components.
 *
 * @returns {QueryContextType} - Object containing cypherQuery, setCypherQuery, queryId, setQueryId,
 * queryName, setQueryName, natLang, setNaturalLanguageQuery, resetQueryContext, setQueryFromQuery,
 * getSelectedQuery, and updatedQuery.
 */
export const useQueryProps = () => useContext(QueryContext);
