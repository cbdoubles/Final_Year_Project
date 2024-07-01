import React, { useState } from "react";
import InputField from "@/src/utils/popUps/InputField";
import { FolderType, QueryType } from "@/src/libs/types";

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
    console.log("changing name");
    console.log(query.queryName);
  };

  const handleCyphertext = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCyphertext(e.target.value);
    console.log("changing cypher");
    console.log(query.cypherQuery);
  };

  const handleNatLang = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNaturalLanguage(e.target.value);
    console.log("changing natlang");
    console.log(query.natLang);
  };

  return (
    <div>
      <InputField
        rows={2}
        label="Query name"
        placeholder="Type here"
        value={query.queryName}
        onChange={handleChangeName}
      />
      <InputField
        rows={4}
        label="Cyphertext representation"
        placeholder="Type here"
        value={query.cypherQuery}
        onChange={handleCyphertext}
      />
      <InputField
        rows={4}
        label="Natural language representation"
        placeholder="Type here"
        value={query.natLang}
        onChange={handleNatLang}
      />
    </div>
  );
};
export default EditQueryBody;
