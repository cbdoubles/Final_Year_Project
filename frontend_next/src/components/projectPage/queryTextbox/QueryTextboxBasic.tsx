import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import QueryTextboxAdvanced from "./QueryTextboxAdvanced";

import "react-toastify/dist/ReactToastify.css";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { useProps } from "@/src/contexts/PropsContext";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { QueryFolderType, QueryType } from "@/src/libs/types";
import { handleError } from "@/src/utils/queryTextbox/helpers/errorHandlers";
import {
  replaceNaturalLanguageParameters,
  replaceParametersInCypherQuery,
} from "@/src/utils/queryTextbox/helpers/parameterReplacers";
import { validateParameters } from "@/src/utils/queryTextbox/helpers/parameterUtils";
import NatLangBox from "@/src/utils/queryTextbox/NatLangBox";
import { handleSaveQuery } from "@/utils/apiCalls/query/handleSaveQuery";
import SavePopUp from "@/utils/queryTextbox/SavePopUp";
import UIButton from "@/utils/ui/UIButton";
import UIModal from "@/utils/ui/UIModal";

// Define interface for component props
interface QueryTextboxBasicProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
  setQueryToRun?: (query: string) => void;
}

// Define interface for input values
interface InputValues {
  [key: string]: string;
}

/**
 * QueryTextboxBasic Component
 *
 * @description
 * This component allows users to input and manage Cypher queries along with natural language descriptions.
 * It supports functionalities like showing the query, running the query, and saving it to favorites.
 *
 * @props
 * @param {boolean} readOnly - Determines if the textbox is read-only.
 * @param {boolean} hideButtons - Determines if the action buttons are hidden.
 * @param {(query: string) => void} setQueryToRun - Callback to set the query to be executed.
 *
 * @state
 * @typedef {Object} InputValues - Stores input values keyed by placeholders.
 * @typedef {QueryType} selectedQuery - Represents the currently selected query.
 * @typedef {boolean} showReadOnlyTextbox - Toggles visibility of the read-only textbox.
 * @typedef {number} boxes - Tracks the number of checkboxes.
 * @typedef {string} saveCyphertext - Stores the Cypher query to be saved.
 * @typedef {string} saveNatLang - Stores the natural language query to be saved.
 * @typedef {QueryFolderType|null} selectedFolder - Stores the selected folder for saving queries.
 * @typedef {string} saveQueryName - Stores the name of the query to be saved.
 */

const QueryTextboxBasic: React.FC<QueryTextboxBasicProps> = ({
  readOnly = false,
  hideButtons = false,
  setQueryToRun,
}) => {
  // Component state and Prop variables
  // These variables manage the state of the component and retrieve context properties
  const { setQueryRunTrue } = useProps();
  const [inputValues, setInputValues] = useState<InputValues>({});
  const { updatedQuery, natLang, cypherQuery, queryName } = useQueryProps();
  const [boxes, setBoxes] = useState(0);
  const { getSelectedQuery, setQueryFromQuery } = useQueryProps();
  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<QueryType>(
    getSelectedQuery()
  );

  const [saveCyphertext, setSaveCyphertext] = useState<string>(
    selectedQuery.cypherQuery
  );
  const [saveNatLang, setSaveNatLang] = useState<string>(selectedQuery.natLang);
  const [selectedFolder, setSelectedFolder] = useState<QueryFolderType | null>(
    null
  );

  // Update state when the query changes
  // This useEffect hook updates the component's state whenever the query is updated
  useEffect(() => {
    setSelectedQuery(updatedQuery);
    setSaveCyphertext(cypherQuery);
    setSaveQueryName(queryName);
    setSaveNatLang(natLang);
  }, [updatedQuery]);

  const { projectId } = useProjectProps();

  const [saveQueryName, setSaveQueryName] = useState<string>(
    selectedQuery.queryName
  );

  /**
   * Toggle showing the Cypher query (Show Cipher Button)
   *
   * @description
   * Toggles the visibility of the Cypher query text area.
   */
  const handleShowCypherQuery = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  /**
   * Handle input changes in the natural language box
   *
   * @description
   * Updates the state with new input values from the natural language box.
   *
   * @param {string} placeholder - The placeholder text associated with the input.
   * @param {string} value - The new value for the input.
   */
  const handleInputChange = (placeholder: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [placeholder]: value }));
  };

  /**
   * Save the query to favorites with validations
   *
   * @description
   * Validates the input values and prepares the query to be saved to favorites.
   *
   * @param {() => void} onOpen - Callback to open the save modal.
   */
  const handleSaveFavorites = (onOpen: () => void) => {
    if (handleError(natLang, inputValues, boxes)) {
      setSaveCyphertext(
        replaceParametersInCypherQuery(saveCyphertext, inputValues)
      );
      setSaveNatLang(
        replaceNaturalLanguageParameters(saveNatLang, inputValues)
      );
      onOpen();
    }
  };

  /**
   * Run the query after validating and replacing parameters
   *
   * @description
   * Validates the input values, replaces parameters in the Cypher query, and runs the query.
   */
  const handleRunQuery = () => {
    if (handleError(natLang, inputValues, boxes)) {
      const parameters: Record<string, string> = {};
      for (const key in inputValues) {
        // Extract the part between $ and {
        const match = key.match(/\$(\w+)\{/);
        if (match) {
          const parameterKey = match[1];
          parameters[parameterKey] = inputValues[key];
        }
      }

      const finalQuery = replaceParametersInCypherQuery(
        cypherQuery,
        inputValues
      );

      if (finalQuery !== "") {
        if (setQueryToRun) {
          setQueryToRun(finalQuery);
        }
        setQueryRunTrue();
      }
    }
  };

  /**
   * Save the query as a favorite after validating and replacing parameters
   *
   * @description
   * Validates the input values, replaces parameters, and saves the query as a favorite.
   *
   * @param {() => void} onClose - Callback to close the save modal.
   */
  const handleSaveFavorite = async (onClose: () => void) => {
    if (selectedFolder === null) {
      toast.error("No folder selected");
    } else {
      if (validateParameters(saveCyphertext, saveNatLang)) {
        const newQuery = await handleSaveQuery(
          saveQueryName,
          saveCyphertext,
          saveNatLang,
          selectedFolder,
          projectId
        );

        if (newQuery !== null) {
          setQueryFromQuery(newQuery);
          setSelectedQuery(newQuery);
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
        <NatLangBox
          dataArray={natLang}
          inputValues={inputValues}
          readOnly={readOnly}
          onCheckValueChange={(checkValue) => {
            setBoxes(checkValue);
          }}
          onInputChange={handleInputChange}
        />
        {!hideButtons && (
          <div className="flex justify-end gap-2 mb-2">
            <UIButton onClick={handleShowCypherQuery}>
              {showReadOnlyTextbox ? "Hide Cypher Query" : "Show Cypher query"}
            </UIButton>

            <UIButton
              className="bg-success-700"
              disabled={readOnly}
              onClick={handleRunQuery}
            >
              Run
            </UIButton>
            <UIModal
              body={
                <SavePopUp
                  cyphertext={saveCyphertext}
                  fav={true}
                  folderType={"Favorite"}
                  natLang={saveNatLang}
                  queryName={saveQueryName}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  updateCyphertext={setSaveCyphertext}
                  updateNaturalLanguage={setSaveNatLang}
                  updateQueryName={setSaveQueryName}
                ></SavePopUp>
              }
              button={({ onOpen }) => (
                <UIButton
                  className="bg-gray-500"
                  onClick={() => handleSaveFavorites(onOpen)}
                >
                  <FontAwesomeIcon className="w-6" icon={faStar} />
                  <p>Add to Favorites</p>
                </UIButton>
              )}
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
                    onClick={() => handleSaveFavorite(onClose)}
                  >
                    Save
                  </UIButton>
                </>
              )}
              header={<span className="text-primary">Save favorite query</span>}
            ></UIModal>
          </div>
        )}
      </div>
      {showReadOnlyTextbox && (
        <QueryTextboxAdvanced hideButtons={true} readOnly={true} />
      )}
    </div>
  );
};

export default QueryTextboxBasic;
