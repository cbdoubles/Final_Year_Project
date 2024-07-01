import React, { useState, useEffect, useRef } from "react";
import UIButton from "../../../utils/ui/UIButton";
import UIModal from "../../../utils/ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
// import CustomPopUp from "@/src/views/PopUps/CustomPopUp";
import QueryTextbox from "../queryTextboxBasic/QueryTextbox";
import SavePopUp from "../../../utils/queryTextbox/SavePopUp";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { toast } from "react-toastify";
import {
  // extractNaturalLanguageParameters,
  extractParameters,
  validateParameters,
} from "@/src/utils/parameterUtils";
import { QueryType, QueryFolderType, FolderType } from "@/src/libs/types";
import { handleSaveQuery } from "@/utils/queryTextbox/fetches/handleSaveQuery";
import { select } from "@nextui-org/theme";
// import NewFolderPopUp from "./NewFolderPopup";
import { Textarea } from "@nextui-org/react";

// const queryFolder: QueryFolderType = {
//   folderId: 6,
//   folderName: "My Folder",
//   folderType: "Custom", // Assigning a valid FolderType
// };

// const folderType = "Custom";

interface QueryTextboxAdvancedProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
  setQuery?: (query: string) => void;
}
const QueryTextboxAdvanced: React.FC<QueryTextboxAdvancedProps> = ({
  readOnly = false,
  initialQuery = "",
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
  const saveChooseFolder = () => {
    console.log("clicked save");
  };
  const [localQuery, setLocalQuery] = useState("");
  const [queryRunClicked, setQueryRunClicked] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);
  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  const handleRunQuery = () => {
    const query = inputRef.current?.value || "";
    if (query === "") {
    } else {
      console.log("Running query:", query);
      setLocalQuery(query);
      if (setQuery) {
        setQuery(query);
      }
      setQueryRunClicked(true); // Initialize the NeovisComponent
      console.log("set query run clicked to true");
    }
  };

  const openSave = async (onOpen: () => void) => {
    setSelectedFolder(null);
    setSaveCyphertext(editCyphertext);
    onOpen();
  };

  // const handleSaveCustom = async (onClose: () => void) => {
  //   if (selectedFolder === null) {
  //     toast.error("No folder selected");
  //     return;
  //   } else {
  //     const cypherParams = extractParameters(saveCyphertext);
  //     const naturalLanguageParams =
  //       extractNaturalLanguageParameters(saveNatLang);

  //     if (cypherParams.length > naturalLanguageParams.length) {
  //       toast.error(
  //         "There are fewer parameters in the natural language box than required"
  //       );
  //       console.log(saveCyphertext, saveNatLang);
  //       return;
  //     } else if (cypherParams.length < naturalLanguageParams.length) {
  //       toast.error(
  //         "There are more parameters in the natural language box than required"
  //       );
  //       console.log(saveCyphertext, saveNatLang);
  //       return;
  //     }

  //     if (validateParameters(saveCyphertext, saveNatLang)) {
  //       const newQuery = await handleSaveQuery(
  //         saveQueryName,
  //         saveCyphertext,
  //         saveNatLang,
  //         selectedFolder,
  //         projectId
  //       );

  //       if (newQuery !== null) {
  //         setQueryFromQuery(newQuery);
  //         setSelectedQuery(newQuery);
  //         onClose();
  //         toast.success("Query saved successfully");
  //       }
  //     } else {
  //       toast.error(
  //         "Not all parameters from cyphertext match in natural language box"
  //       );
  //       console.log(saveCyphertext, saveNatLang);
  //     }
  //   }
  // };

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

  //TODO see if we need defaultValue = {localQuery}, or defaultValue = {editCyphertext}, for passing it to NeoVis
  return (
    <div className="flex flex-col h-50 w-full">
      <div className="text-md text-black">
        {"Ensure that the Project ID is incorported in the query"}
      </div>
      <textarea
        ref={inputRef}
        className="w-full h-20 p-2 text-lg border rounded border-gray-300 mb-2 resize-none text-black"
        value={editCyphertext}
        onChange={(e) => setEditCyphertext(e.target.value)}
        defaultValue={localQuery}
        placeholder="Enter your query here"
        readOnly={readOnly}
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
              button={({ onOpen }) => (
                <UIButton
                  className="bg-gray-500"
                  onClick={() => handleSaveOpen(onOpen)}
                >
                  <FontAwesomeIcon icon={faStar} className="w-6" />
                  Add to Favorites
                </UIButton>
              )}
              header={<span className="text-primary">Save favorite query</span>}
              body={
                <SavePopUp
                  saveChooseFolder={saveChooseFolder}
                  queryName={saveQueryName}
                  cyphertext={saveCyphertext}
                  natLang={saveNatLang}
                  updateQueryName={setSaveQueryName}
                  updateCyphertext={setSaveCyphertext}
                  updateNaturalLanguage={setSaveNatLang}
                  folderType={"Favorite"}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                />
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
            />
            <UIModal
              button={({ onOpen }) => (
                <UIButton
                  className="bg-gray-500"
                  onClick={() => openSave(onOpen)}
                >
                  <FontAwesomeIcon icon={faStar} className="w-6" />
                  Add to Customs
                </UIButton>
              )}
              header={<span className="text-primary">Save custom query</span>}
              body={
                <SavePopUp
                  saveChooseFolder={saveChooseFolder}
                  queryName={saveQueryName}
                  cyphertext={saveCyphertext}
                  natLang={saveNatLang}
                  updateQueryName={setSaveQueryName}
                  updateCyphertext={setSaveCyphertext}
                  updateNaturalLanguage={setSaveNatLang}
                  folderType={"Custom"}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                />
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
            />
          </div>
          {showReadOnlyTextbox && (
            <QueryTextbox
              readOnly={true}
              initialQuery={saveNatLang}
              hideButtons={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QueryTextboxAdvanced;
