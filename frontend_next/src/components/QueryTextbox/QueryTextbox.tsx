import React, { useState } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import NatLangBox from "@/src/utils/NatLangBox";
import { useProps } from "@/src/contexts/PropsContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { split } from "postcss/lib/list";
import {
  extractParameters,
  extractNaturalLanguageParameters,
  validateParameters,
} from "@/src/utils/parameterUtils";
import { handleSaveQuery } from "@/utils/queryTextbox/fetches/handleSaveQuery";
import SavePopUp from "./SavePopUp";

interface QueryTextboxProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
}

interface InputValues {
  [key: string]: string;
}

const QueryTextbox: React.FC<QueryTextboxProps> = ({
  readOnly = false,
  initialQuery = "",
  hideButtons = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const { queryRunClicked, setQueryRunTrue } = useProps();
  const [inputValues, setInputValues] = useState<InputValues>({});
  const { natLang, cypherQuery, queryName, updatedQuery, setQueryFromQuery } =
    useQueryProps();
  const [boxes, setBoxes] = useState(2);
  const [editCyphertext, setEditCyphertext] = useState<string>(cypherQuery);
  const [saveQueryName, setSaveQueryName] = useState<string>(queryName);
  const [saveCyphertext, setSaveCyphertext] = useState<string>(editCyphertext);
  const [saveNatLang, setSaveNatLang] = useState<string>(natLang);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleInputChange = (placeholder: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [placeholder]: value }));
  };

  const handleError = (onOpen: () => void) => {
    if (Object.keys(inputValues).length < boxes) {
      toast.error("Fill in the query text before adding to favourites.", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }
    for (const key in inputValues) {
      if (inputValues[key] === "") {
        toast.error("Fill in the query text before adding to favourites.", {
          position: "bottom-right",
          theme: "colored",
        });
        return;
      }
    }
    onOpen();
  };

  const handleShowQuery = () => {
    // Add logic to show cypher query
  };

  const replaceParametersInQuery = (query: string, params: InputValues) => {
    let resultQuery = query;
    for (const key in params) {
      const realkey = key.split("{")[0];
      const regex = new RegExp("\\" + realkey, "g");
      resultQuery = resultQuery.replace(regex, params[key]);
    }
    return resultQuery;
  };

  const handleRunQuery = () => {
    const parameters: Record<string, string> = {};
    for (const key in inputValues) {
      const match = key.match(/\$(\w+)\{/);
      if (match) {
        const parameterKey = match[1];
        parameters[parameterKey] = inputValues[key];
      }
    }

    const jsonOutput = {
      Parameter: parameters,
      Query: cypherQuery,
    };

    console.log("Generated JSON Output:", jsonOutput);
    const finalQuery = replaceParametersInQuery(cypherQuery, inputValues);
    console.log("Final Cypher Query:", finalQuery);

    setQueryRunTrue();
  };

  const handleSaveCustom = async (onClose: () => void) => {
    if (selectedFolder === null) {
      toast.error("No folder selected");
      return;
    } else {
      const cypherParams = extractParameters(saveCyphertext);
      const naturalLanguageParams =
        extractNaturalLanguageParameters(saveNatLang);

      if (cypherParams.length > naturalLanguageParams.length) {
        toast.error(
          "There are fewer parameters in the natural language box than required"
        );
        console.log(saveCyphertext, saveNatLang);
        return;
      } else if (cypherParams.length < naturalLanguageParams.length) {
        toast.error(
          "There are more parameters in the natural language box than required"
        );
        console.log(saveCyphertext, saveNatLang);
        return;
      }

      if (validateParameters(saveCyphertext, saveNatLang)) {
        const newQuery = await handleSaveQuery(
          saveQueryName,
          saveCyphertext,
          saveNatLang,
          selectedFolder,
          updatedQuery.projectId
        );

        if (newQuery !== null) {
          setQueryFromQuery(newQuery);
          onClose();
          toast.success("Query saved successfully");
        }
      } else {
        toast.error(
          "Not all parameters from cyphertext match in natural language box"
        );
        console.log(saveCyphertext, saveNatLang);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="text-md text-black">{"Query: " + queryName}</div>
        <NatLangBox
          dataArray={natLang}
          inputValues={inputValues}
          onInputChange={handleInputChange}
          onCheckValueChange={(checkValue) => {
            setBoxes(checkValue);
          }}
        />
        {!hideButtons && (
          <div className="flex justify-end gap-2 mb-2">
            <UIButton
              onClick={handleShowQuery}
              disabled={readOnly}
              className="bg-primary"
            >
              Show Cypher
            </UIButton>
            <UIButton
              onClick={handleRunQuery}
              disabled={readOnly}
              className="bg-success-700"
            >
              Run
            </UIButton>
            <UIModal
              button={({ onOpen }) => (
                <UIButton className="bg-gray-500" onClick={onOpen}>
                  <FontAwesomeIcon icon={faStar} className="w-6" />
                  <p>Add to Favorites</p>
                </UIButton>
              )}
              header={<span className="text-primary">Save favorite query</span>}
              body={
                <SavePopUp
                  saveChooseFolder={() => {}}
                  queryName={saveQueryName}
                  cyphertext={saveCyphertext}
                  natLang={saveNatLang}
                  updateQueryName={setSaveQueryName}
                  updateCyphertext={setSaveCyphertext}
                  updateNaturalLanguage={setSaveNatLang}
                  folderType={"Favorite"}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  readOnlyCyphertext={true}
                  readOnlyNatLang={true}
                ></SavePopUp>
              }
              footer={({ onClose }) => (
                <>
                  <UIButton
                    className=" bg-danger w-full text-lg"
                    onClick={onClose}
                  >
                    Cancel
                  </UIButton>
                  <UIButton
                    className="bg-success-700 w-full text-lg"
                    onClick={() => handleSaveCustom(onClose)}
                  >
                    Save
                  </UIButton>
                </>
              )}
            ></UIModal>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryTextbox;
