import React, { useState } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CustomPopUp from "@/src/views/PopUps/CustomPopUp";
import QueryTextbox from "../queryTextbox/QueryTextbox";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import FileOpenButt from "../ui/FileOpenButt";
import { toast } from "react-toastify";
import { validateParameters } from "@/src/utils/parameterUtils";

const QueryTextboxAdvanced: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [error, setError] = useState<string | null>(null);
  const [naturalLanguage, setNaturalLanguage] = useState("");

  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  const handleRunQuery = () => {
    console.log("Running query:", query);
  };

  const handleSaveCustom = () => {
    console.log("handleSaveCustom called");
    if (validateParameters(query, naturalLanguage)) {
      console.log("Success");
      toast.success("Query saved successfully");
    } else {
      console.log("Not matching");
      toast.error(
        "Not all parameters from cyphertext are present in natural language box"
      );
    }
  };

  interface InputValues {
    [key: string]: string;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <textarea
        className="w-full h-20 p-2 text-lg border rounded border-gray-300 mb-2 mt-5 resize-none text-black"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
              naturalLanguage={naturalLanguage}
              setNaturalLanguage={setNaturalLanguage}
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
            <CustomPopUp
              query={query}
              setQuery={setQuery}
              naturalLanguage={naturalLanguage}
              setNaturalLanguage={setNaturalLanguage}
            ></CustomPopUp>
          }
          footer={({ onClose }) => (
            <>
              <UIButton className=" bg-danger w-full text-lg" onClick={onClose}>
                Cancel
              </UIButton>
              {/* <FileOpenButt
                className="bg-success-700 w-full text-lg"
                onClick={() => {
                  handleSaveCustom();
                  onClose();
                }}
              >
                Save
              </FileOpenButt> */}
              {/* New Test Save Button */}
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
