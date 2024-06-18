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
  // updateQueryFolder: (newFolder: string) => void;
  // updateQueryState: (
  //   queryName: string,
  //   cyphertext: string,
  //   natLang: string
  // ) => void;
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
  // updateQueryFolder,
  // updateQueryState,
}) => {
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryName(e.target.value);
  };

  const handleCyphertext = (e: React.ChangeEvent<HTMLInputElement>) => {
    // updateCyphertext(e.target.value);
    updateCyphertext(e.target.value);
    console.log(cyphertext);
  };

  const handleNatLang = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNaturalLanguage(e.target.value);
    console.log(natLang);
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
      {/* <UIButton className="bg-success-700" onClick={handleCloseModal}>
        Save
      </UIButton> */}
      /
    </div>
  );
};
export default SavePopUp;
