import React, { useState } from "react";
import InputField from "@/src/components/popUps/InputField";
import UIButton from "../ui/UIButton";

type SavePopUpProps = {
  fav?: boolean;
  saveChooseFolder: () => void;
  queryName: string;
  cyphertext: string;
  natLang: string;
  updateQueryName: (newFolderName: string) => void;
  updateCyphertext: (newCyphertext: string) => void;
  updateNaturalLanguage: (newNaturalLanguage: string) => void;
  setQueryFolder: (newNaturalLanguage: string) => void;
};

const SavePopUp: React.FC<SavePopUpProps> = ({
  fav,
  saveChooseFolder,
  queryName,
  cyphertext,
  natLang,
  updateQueryName,
  updateCyphertext,
  updateNaturalLanguage,
  setQueryFolder,
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
        rows={2}
        label="Query name"
        placeholder="Type here"
        value={queryName}
        onChange={handleChangeName}
      />
      <InputField
        readOnly={fav ? true : false}
        rows={4}
        label="Cyphertext representation"
        placeholder="Type here"
        value={cyphertext}
        onChange={handleCyphertext}
      />
      <InputField
        readOnly={fav ? true : false}
        rows={4}
        label="Natural language representation"
        placeholder="Type here"
        value={natLang}
        onChange={handleNatLang}
      />
      <UIButton color="primary" onClick={saveChooseFolder}>
        Choose folder
      </UIButton>
      /
    </div>
  );
};
export default SavePopUp;
