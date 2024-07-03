import React from "react";

import { useQueryProps } from "@/src/contexts/QueryContext";

// Test component to interact with QueryContext
const TestComponent = () => {
  const {
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
  } = useQueryProps();

  return (
    <div>
      <div>
        <span id="cypher-query">Cypher Query: {cypherQuery}</span>
        <button
          id="set-cypher-query"
          onClick={() => setCypherQuery("MATCH (n) RETURN n")}
        >
          Set Cypher Query
        </button>
      </div>
      <div>
        <span id="query-id">Query ID: {queryId}</span>
        <button id="set-query-id" onClick={() => setQueryId(42)}>
          Set Query ID
        </button>
      </div>
      <div>
        <span id="query-name">Query Name: {queryName}</span>
        <button id="set-query-name" onClick={() => setQueryName("Test Query")}>
          Set Query Name
        </button>
      </div>
      <div>
        <span id="nat-lang">Natural Language: {natLang}</span>
        <button
          id="set-nat-lang"
          onClick={() => setNaturalLanguageQuery("Find all nodes")}
        >
          Set Nat Lang
        </button>
      </div>
      <button id="reset-query-context" onClick={resetQueryContext}>
        Reset Query Context
      </button>
      <button
        id="set-query-from-query"
        onClick={() =>
          setQueryFromQuery({
            queryId: 1,
            queryName: "Test Query From Object",
            cypherQuery: "MATCH (n) RETURN n",
            natLang: "Find all nodes",
          })
        }
      >
        Set Query From Object
      </button>
    </div>
  );
};

export default TestComponent;
