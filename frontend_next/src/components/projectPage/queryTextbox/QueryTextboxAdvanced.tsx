import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import QueryTextbox from "./QueryTextboxBasic";

import { useProjectProps } from "@/src/contexts/ProjectContext";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { QueryType, QueryFolderType } from "@/src/libs/types";
import { validateParameters } from "@/src/utils/queryTextbox/helpers/parameterUtils";
import { handleSaveQuery } from "@/utils/apiCalls/query/handleSaveQuery";
import SavePopUp from "@/utils/queryTextbox/SavePopUp";
import UIButton from "@/utils/ui/UIButton";
import UIModal from "@/utils/ui/UIModal";

interface QueryTextboxAdvancedProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
  setQuery?: (query: string) => void;
}
const QueryTextboxAdvanced: React.FC<QueryTextboxAdvancedProps> = ({
  readOnly = false,
  hideButtons = false,
  setQuery,
}) => {
  const { updatedQuery, cypherQuery, queryName, natLang, setQueryFromQuery } =
    useQueryProps();
  const [selectedQuery, setSelectedQuery] = useState<QueryType>(updatedQuery);

  useEffect(() => {
    setSelectedQuery(updatedQuery);
    setEditCyphertext(cypherQuery);
    setSaveQueryName(queryName);
    setSaveNatLang(natLang);
  }, [updatedQuery]);

  const { projectId } = useProjectProps();
  const [editCyphertext, setEditCyphertext] = useState<string>(
    selectedQuery.cypherQuery
  );
  const [saveQueryName, setSaveQueryName] = useState<string>(
    selectedQuery.queryName
  );
  const [saveCyphertext, setSaveCyphertext] = useState<string>(editCyphertext);
  const [saveNatLang, setSaveNatLang] = useState<string>(selectedQuery.natLang);
  const [selectedFolder, setSelectedFolder] = useState<QueryFolderType | null>(
    null
  );

  const [localQuery, setLocalQuery] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);

  /**
   * handleShowNaturalLang
   *
   * @description
   * Toggles the visibility of the natural language query textbox.
   *
   * @param {boolean} showReadOnlyTextbox - Current state of the natural language textbox visibility.
   * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowReadOnlyTextbox - State setter function.
   */
  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  /**
   * handleRunQuery
   *
   * @description
   * Runs the query by setting the localQuery state and calling the setQuery callback if provided.
   *
   * @param {React.RefObject<HTMLTextAreaElement>} inputRef - Reference to the query input element.
   * @param {React.Dispatch<React.SetStateAction<string>>} setLocalQuery - State setter function for local query.
   * @param {(query: string) => void} [setQuery] - Optional callback to set the query.
   */
  const handleRunQuery = () => {
    const query = inputRef.current?.value || "";
    if (query === "") {
    } else {
      setLocalQuery(query);
      if (setQuery) {
        setQuery(query);
      }
    }
  };

  /**
   * openSave
   *
   * @description
   * Prepares to open the save modal by resetting the selected folder and setting the saveCyphertext.
   *
   * @param {() => void} onOpen - Function to open the modal.
   * @param {React.Dispatch<React.SetStateAction<QueryFolderType | null>>} setSelectedFolder - State setter function for selected folder.
   * @param {string} editCyphertext - The current cypher query text being edited.
   * @param {React.Dispatch<React.SetStateAction<string>>} setSaveCyphertext - State setter function for save cyphertext.
   */
  const openSave = async (onOpen: () => void) => {
    setSelectedFolder(null);
    setSaveCyphertext(editCyphertext);
    onOpen();
  };

  /**
   * handleSaveCustom
   *
   * @description
   * Handles saving a custom query by validating the parameters and saving the query.
   *
   * @param {() => void} onClose - Function to close the modal.
   * @param {string} saveCyphertext - The cypher query text to save.
   * @param {string} saveNatLang - The natural language text to save.
   * @param {QueryFolderType | null} selectedFolder - The selected folder to save the query into.
   * @param {number} projectId - The project ID associated with the query.
   * @param {(query: QueryType) => void} setQueryFromQuery - Function to set the query from the saved query.
   * @param {React.Dispatch<React.SetStateAction<QueryType>>} setSelectedQuery - State setter function for selected query.
   */
  const handleSaveCustom = async (onClose: () => void) => {
    if (validateParameters(saveCyphertext, saveNatLang)) {
      if (selectedFolder === null) {
        toast.error("No folder selected");
        return;
      }
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
        "Not all parameters from cyphertext are present in natural language box"
      );
    }
  };

  const handleSaveOpen = (opOpen: () => void) => {
    setSelectedFolder(null);
    opOpen();
  };

  return (
    <div className="flex flex-col h-50 w-full">
      <div className="text-md text-black">
        {"Ensure that the Project ID is incorported in the query"}
      </div>
      <textarea
        ref={inputRef}
        className="w-full h-20 p-2 text-lg border rounded border-gray-300 mb-2 resize-none text-black"
        data-testid="advanced-query-text-box"
        defaultValue={localQuery}
        placeholder="Enter your query here"
        readOnly={readOnly}
        value={editCyphertext}
        onChange={(e) => setEditCyphertext(e.target.value)}
      />
      {!hideButtons && (
        <>
          <div className="flex justify-end gap-2 mb-2">
            <UIButton
              data-testid="hide-show-naural-lang-button"
              onClick={handleShowNaturalLang}
            >
              {showReadOnlyTextbox ? "Hide Natural Lang" : "Show Natural Lang"}
            </UIButton>
            <UIButton
              className="bg-success-700"
              data-testid="run-button"
              onClick={handleRunQuery}
            >
              Run
            </UIButton>
            <UIModal
              body={
                <SavePopUp
                  cyphertext={saveCyphertext}
                  folderType={"Favorite"}
                  natLang={saveNatLang}
                  queryName={saveQueryName}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  updateCyphertext={setSaveCyphertext}
                  updateNaturalLanguage={setSaveNatLang}
                  updateQueryName={setSaveQueryName}
                />
              }
              button={({ onOpen }) => (
                <UIButton
                  className="bg-gray-500"
                  data-testid="add-favorite-button"
                  onClick={() => handleSaveOpen(onOpen)}
                >
                  <FontAwesomeIcon className="w-6" icon={faStar} />
                  Add to Favorites
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
                    onClick={() => handleSaveCustom(onClose)}
                  >
                    Save
                  </UIButton>
                </>
              )}
              header={<span className="text-primary">Save favorite query</span>}
            />
            <UIModal
              body={
                <SavePopUp
                  cyphertext={saveCyphertext}
                  folderType={"Custom"}
                  natLang={saveNatLang}
                  queryName={saveQueryName}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  updateCyphertext={setSaveCyphertext}
                  updateNaturalLanguage={setSaveNatLang}
                  updateQueryName={setSaveQueryName}
                />
              }
              button={({ onOpen }) => (
                <UIButton
                  className="bg-gray-500"
                  data-testid="add-custom-button"
                  onClick={() => openSave(onOpen)}
                >
                  <FontAwesomeIcon className="w-6" icon={faStar} />
                  Add to Customs
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
                    onClick={() => handleSaveCustom(onClose)}
                  >
                    Save
                  </UIButton>
                </>
              )}
              header={<span className="text-primary">Save custom query</span>}
            />
          </div>
          {showReadOnlyTextbox && (
            <QueryTextbox
              hideButtons={true}
              initialQuery={saveNatLang}
              readOnly={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QueryTextboxAdvanced;
