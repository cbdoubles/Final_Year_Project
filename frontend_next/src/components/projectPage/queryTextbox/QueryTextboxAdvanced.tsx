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
  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

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

  const openSave = async (onOpen: () => void) => {
    setSelectedFolder(null);
    setSaveCyphertext(editCyphertext);
    onOpen();
  };

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
        defaultValue={localQuery}
        placeholder="Enter your query here"
        readOnly={readOnly}
        value={editCyphertext}
        onChange={(e) => setEditCyphertext(e.target.value)}
      />
      {!hideButtons && (
        <>
          <div className="flex justify-end gap-2 mb-2">
            <UIButton onClick={handleShowNaturalLang}>
              {showReadOnlyTextbox ? "Hide Natural Lang" : "Show Natural Lang"}
            </UIButton>
            <UIButton className="bg-success-700" onClick={handleRunQuery}>
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
