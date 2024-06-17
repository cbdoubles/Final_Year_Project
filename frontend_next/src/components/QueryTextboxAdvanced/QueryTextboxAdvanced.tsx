import React, { useState } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CustomPopUp from "@/src/views/PopUps/CustomPopUp";
import QueryTextbox from "../queryTextbox/QueryTextbox";
import SavePopUp from "./SavePopUp";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { toast } from "react-toastify";
import { validateParameters } from "@/src/utils/parameterUtils";

const QueryTextboxAdvanced: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);

  const { queryName, cypherQuery, naturalLanguageQuery } = useQueryProps();

  const [curentQueryName, setQueryName] = useState<string>(queryName);
  const [currentQueryCyphertext, setCyphertext] = useState<string>(cypherQuery);
  const [curentQueryNatLang, setNatLang] =
    useState<string>(naturalLanguageQuery);
  const [queryFolder, setQueryFolder] = useState<string>(queryName);

  const saveChooseFolder = () => {
    console.log("clicked save");
  };

  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  const handleRunQuery = () => {
    console.log("Running query:", query);
  };

  const handleSaveCustom = () => {
    console.log("handleSaveCustom called");
    if (validateParameters(currentQueryCyphertext, curentQueryNatLang)) {
      console.log("Success");
      toast.success("Query saved successfully");
    } else {
      console.log("Not matching");
      toast.error(
        "Not all parameters from cyphertext are present in natural language box"
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <textarea
        className="w-full h-20 p-2 text-lg border rounded border-gray-300 mb-2 mt-5 resize-none text-black"
        value={currentQueryCyphertext}
        onChange={(e) => setCyphertext(e.target.value)}
        placeholder="Enter your query here"
      />
      <div className="flex justify-end gap-2 mb-2">
        <UIButton onClick={handleShowNaturalLang}>
          {showReadOnlyTextbox ? "Hide Natural Lang" : "Show Natural Lang"}
        </UIButton>
        <UIButton className="bg-success-700" onClick={handleRunQuery}>
          Run
        </UIButton>
        <UIModal
          button={({ onOpen }) => (
            <UIButton className="bg-gray-500" onClick={onOpen}>
              <FontAwesomeIcon icon={faStar} className="w-6" />
              Add to Favorites
            </UIButton>
          )}
          header={<span className="text-primary">Save favorite query</span>}
          body={
            <CustomPopUp
              fav={true}
              query={query}
              setQuery={setQuery}
              naturalLanguage={curentQueryNatLang}
              setNaturalLanguage={setNatLang}
            ></CustomPopUp>
          }
        ></UIModal>
        <UIModal
          button={({ onOpen }) => (
            <UIButton className="bg-gray-500" onClick={onOpen}>
              <FontAwesomeIcon icon={faStar} className="w-6" />
              Add to Customs
            </UIButton>
          )}
          header={<span className="text-primary">Save custom query</span>}
          body={
            <SavePopUp
              saveChooseFolder={saveChooseFolder}
              queryName={curentQueryName}
              cyphertext={currentQueryCyphertext}
              natLang={curentQueryNatLang}
              updateQueryName={setQueryName}
              updateCyphertext={setCyphertext}
              updateNaturalLanguage={setNatLang}
              setQueryFolder={setQueryFolder}
            ></SavePopUp>
          }
          footer={({ onClose }) => (
            <>
              <UIButton className=" bg-danger w-full text-lg" onClick={onClose}>
                Cancel
              </UIButton>
              <UIButton
                className="bg-success-700 w-full text-lg"
                onClick={handleSaveCustom}
              >
                Save
              </UIButton>
            </>
          )}
        ></UIModal>
      </div>
      {showReadOnlyTextbox && (
        <QueryTextbox readOnly={true} initialQuery={query} hideButtons={true} />
      )}
    </div>
  );
};

export default QueryTextboxAdvanced;
