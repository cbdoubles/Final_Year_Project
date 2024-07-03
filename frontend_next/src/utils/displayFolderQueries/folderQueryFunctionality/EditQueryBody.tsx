import React, { useState } from "react";
import InputField from "@/src/utils/popUps/InputField";
import { FolderType, QueryType } from "@/src/libs/types";

/**
 * @description
 * EditQueryBody Component
 * This component provides input fields for editing the details of a query, including its name, cyphertext representation,
 * and natural language representation. It is designed to be used within a form or a modal where users can update the
 * attributes of a query.
 *
 * @props
 * @param {QueryType} query - The current query object containing the details to be edited.
 * @param {FolderType} type - The type of folder the query belongs to. This prop is currently not used in the component but could be utilized for future enhancements.
 * @param {(newFolderName: string) => void} updateQueryName - Function to update the query's name.
 * @param {(newCyphertext: string) => void} updateCyphertext - Function to update the query's cyphertext representation.
 * @param {(newNaturalLanguage: string) => void} updateNaturalLanguage - Function to update the query's natural language representation.
 *
 * @state
 * @param {boolean} open - State to control the visibility of the folder's queries. True if the queries are visible.
 * @param {QueryFolderType} folder - State representing the current folder. It starts with the folder passed in props and can be updated.
 * @param {QueryType[]} queries - State representing the list of queries within the folder. It starts with the queries passed in props and can be updated.
 * @param {number | null} selectedButtonId - State to track the ID of the selected query button. Null if no button is selected.
 */

const EditQueryBody = ({
  query,
  type,
  updateQueryName,
  updateCyphertext,
  updateNaturalLanguage,
}: {
  query: QueryType;
  type: FolderType;
  updateQueryName: (newFolderName: string) => void;
  updateCyphertext: (newCyphertext: string) => void;
  updateNaturalLanguage: (newNaturalLanguage: string) => void;
}) => {
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryName(e.target.value);
  };

  const handleCyphertext = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCyphertext(e.target.value);
  };

  const handleNatLang = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNaturalLanguage(e.target.value);
  };

  return (
    <div>
      <InputField
        label="Query name"
        placeholder="Type here"
        rows={2}
        value={query.queryName}
        onChange={handleChangeName}
      />
      <InputField
        label="Cyphertext representation"
        placeholder="Type here"
        rows={4}
        value={query.cypherQuery}
        onChange={handleCyphertext}
      />
      <InputField
        label="Natural language representation"
        placeholder="Type here"
        rows={4}
        value={query.natLang}
        onChange={handleNatLang}
      />
    </div>
  );
};
export default EditQueryBody;
