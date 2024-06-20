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
import { validateParameters } from "@/src/utils/parameterUtils";
import { QueryType, QueryFolderType, FolderType } from "@/src/libs/types";
import { handleSaveQuery } from "@/utils/queryTextbox/fetches/handleSaveQuery";
import { select } from "@nextui-org/theme";
import { Textarea } from "@nextui-org/react";

const queryFolder: QueryFolderType = {
  folderId: 6,
  folderName: "My Folder",
  folderType: "Custom", // Assigning a valid FolderType
};
interface QueryTextboxAdvancedProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
}
const QueryTextboxAdvanced: React.FC<QueryTextboxAdvancedProps> = ({
  readOnly = false,
  initialQuery = "",
  hideButtons = false,
}) => {
  const { getSelectedQuery, setQueryFromQuery } = useQueryProps();
  const [selectedQuery, setSelectedQuery] = useState<QueryType>(
    getSelectedQuery()
  );
  const { projectId } = useProjectProps();
  const [editCyphertext, setEditCyphertext] = useState<string>(
    selectedQuery.cypherQuery
  );
  const [saveQueryName, setSaveQueryName] = useState<string>(
    selectedQuery.queryName
  );
  const [saveCyphertext, setSaveCyphertext] = useState<string>(editCyphertext);
  const [saveNatLang, setSaveNatLang] = useState<string>(selectedQuery.natLang);
  const [saveQueryFolder, setSaveQueryFolder] = useState<FolderType | null>(
    null
  );

  const saveChooseFolder = () => {
    console.log("clicked save");
  };

  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);
  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
    console.log("context query");
    console.log(getSelectedQuery());
    console.log("selected query");
    console.log(selectedQuery);
  };

  const handleRunQuery = () => {
    console.log("Running query:", selectedQuery);
  };

  const handleSaveCustom = async (onClose: () => void) => {
    if (validateParameters(saveCyphertext, saveNatLang)) {
      console.log("Success");
      const newQuery = await handleSaveQuery(
        saveQueryName,
        saveCyphertext,
        saveNatLang,
        queryFolder,
        projectId
      );

      if (newQuery !== null) {
        console.log("newquery in handle custom");
        console.log(newQuery);
        setQueryFromQuery(newQuery);
        setSelectedQuery(newQuery);
        setEditCyphertext(newQuery.cypherQuery);
        onClose();
        toast.success("Query saved successfully");
      } else {
        console.log("not a successful save query");
      }
      console.log("context query");
      console.log(getSelectedQuery());
      console.log("selected query");
      console.log(selectedQuery);
    } else {
      console.log("Not matching");
      toast.error(
        "Not all parameters from cyphertext are present in natural language box"
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Textarea
        className="bg-white w-full h-20 p-2 text-lg border border-gray-300 mb-2 mt-5 resize-none text-black"
        value={editCyphertext}
        onChange={(e) => setEditCyphertext(e.target.value)}
        placeholder="Enter your query here"
        readOnly={readOnly}
      />
      {!hideButtons && (
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
                query={saveNatLang}
                setQuery={setSaveNatLang}
                naturalLanguage={saveNatLang}
                setNaturalLanguage={setSaveNatLang}
              ></CustomPopUp>
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
                queryName={saveQueryName}
                cyphertext={saveCyphertext}
                natLang={saveNatLang}
                // updateQueryState={updateQueryState}
                updateQueryName={setSaveQueryName}
                updateCyphertext={setSaveCyphertext}
                updateNaturalLanguage={setSaveNatLang}
                // setQueryFolder={setQueryFolder}
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
