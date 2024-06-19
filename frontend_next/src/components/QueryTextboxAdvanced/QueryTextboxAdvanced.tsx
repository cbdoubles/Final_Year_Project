import React, { useState, useEffect } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CustomPopUp from "@/src/views/PopUps/CustomPopUp";
import QueryTextbox from "../queryTextbox/QueryTextbox";
import SavePopUp from "./SavePopUp";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { toast } from "react-toastify";
import {
  extractNaturalLanguageParameters,
  extractParameters,
  validateParameters,
} from "@/src/utils/parameterUtils";
import { QueryType, QueryFolderType, FolderType } from "@/src/libs/types";
import { handleSaveQuery } from "@/utils/queryTextbox/fetches/handleSaveQuery";
import { select } from "@nextui-org/theme";
import NewFolderPopUp from "./NewFolderPopup";

const queryFolder: QueryFolderType = {
  folderId: 6,
  folderName: "My Folder",
  folderType: "Custom", // Assigning a valid FolderType
};

const folderType = "Custom";

type QueryTextboxAdvancedProps = {
  // selectedQuery: QueryType;
};

const QueryTextboxAdvanced: React.FC<QueryTextboxAdvancedProps> = (
  {
    // selectedQuery,
  }
) => {
  const { updatedQuery, cypherQuery, queryName, setQueryFromQuery } =
    useQueryProps();
  const [selectedQuery, setSelectedQuery] = useState<QueryType>(updatedQuery);

  useEffect(() => {
    setSelectedQuery(updatedQuery);
    setEditCyphertext(cypherQuery);
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

  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);

  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  const handleRunQuery = () => {
    console.log("Running query:", selectedQuery);
  };

  const openSave = async (onOpen: () => void) => {
    setSelectedFolder(null);
    setSaveCyphertext(editCyphertext);
    onOpen();
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
    <div className="flex flex-col h-full w-full">
      <div className="text-md text-black">{"Query: " + queryName}</div>
      <textarea
        className="w-full h-20 p-2 text-lg border rounded border-gray-300 mb-2 resize-none text-black"
        value={editCyphertext}
        onChange={(e) => setEditCyphertext(e.target.value)}
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
              // setQueryFolder={setQueryFolder}
            ></SavePopUp>
          }
          footer={({ onClose }) => (
            <>
              <UIButton className=" bg-danger w-full text-lg" onClick={onClose}>
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
        <UIModal
          button={({ onOpen }) => (
            <UIButton className="bg-gray-500" onClick={() => openSave(onOpen)}>
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
              // setQueryFolder={setQueryFolder}
            ></SavePopUp>
          }
          footer={({ onClose }) => (
            <>
              <UIButton className=" bg-danger w-full text-lg" onClick={onClose}>
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
      {showReadOnlyTextbox && (
        <QueryTextbox
          readOnly={true}
          initialQuery={saveNatLang}
          hideButtons={true}
        />
      )}
    </div>
  );
};

export default QueryTextboxAdvanced;
