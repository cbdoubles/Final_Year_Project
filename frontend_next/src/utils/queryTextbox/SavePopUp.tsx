import React, { useState, useEffect } from "react";
import InputField from "@/src/utils/popUps/InputField";
import UIButton from "../ui/UIButton";
import SelectFolder from "./SelectFolder";
import { QueryFolderType, FolderType } from "@/src/libs/types";
import UIModal from "../ui/UIModal";
import { toast } from "react-toastify";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { fetchFolders } from "@/src/utils/apiCalls/folder/fetchFolders";
import { handleSaveFolder } from "@/src/utils/apiCalls/folder/handleSaveFolder";
import NewFolderPopUp from "./NewFolderPopup";

type SavePopUpProps = {
  fav?: boolean;
  saveChooseFolder: () => void;
  queryName: string;
  cyphertext: string;
  natLang: string;
  selectedFolder: QueryFolderType | null;
  folderType: FolderType;
  updateQueryName: (newFolderName: string) => void;
  updateCyphertext: (newCyphertext: string) => void;
  updateNaturalLanguage: (newNaturalLanguage: string) => void;
  setSelectedFolder: (folder: QueryFolderType | null) => void;
};

const SavePopUp: React.FC<SavePopUpProps> = ({
  fav,
  queryName,
  cyphertext,
  natLang,
  selectedFolder,
  folderType,
  updateQueryName,
  updateCyphertext,
  updateNaturalLanguage,
  setSelectedFolder,
}) => {
  const { projectId } = useProjectProps();

  const [folders, setFolders] = useState<QueryFolderType[] | null>(null);

  const [showNewFolderPopup, setShowNewFolderPopup] = useState(false);

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

  const handleSelectFolder = async (onClose: () => void) => {
    if (selectedFolder) {
      onClose();
    } else {
      toast.error("No folder selected");
    }
  };
  const openSelectFolder = async (onOpen: () => void) => {
    const result = await fetchFolders(projectId, folderType);
    console.log("Fetched folders:", result);
    if (result) {
      console.log("setting result value");
      console.log(result);
      setFolders(result);
      console.log(folders);
      onOpen();
    } else {
      toast.error("No folder selected");
    }
  };

  const handleCreateNewFolder = async (folderName: string) => {
    // Logic to create a new folder and update the folders state
    const newFolder = await handleSaveFolder(folderName, folderType, projectId);

    if (newFolder) {
      setFolders([...(folders || []), newFolder]);
      setSelectedFolder(newFolder);
    }
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
        // readOnly={fav ? true : false}
        rows={4}
        label="Natural language representation"
        placeholder="Type here"
        value={natLang}
        onChange={handleNatLang}
      />
      {/* Title for selecting a folder */}
      <label className="text-black text-sm block mb-2">Select folder</label>
      <UIModal
        button={({ onOpen }) => (
          <UIButton
            data-testid="ui-button"
            onClick={() => openSelectFolder(onOpen)}
          >
            {selectedFolder ? selectedFolder.folderName : "Select folder"}
          </UIButton>
        )}
        header={<p className="text-primary">select folder</p>}
        body={
          <div>
            <SelectFolder
              folders={folders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />
          </div>
        }
        footer={({ onClose }) => (
          <>
            <div className="w-full flex justify-between mt-4 text-black">
              <UIModal
                button={({ onOpen }) => (
                  <UIButton className="bg-success-700" onClick={onOpen}>
                    Create New Folder
                  </UIButton>
                )}
                header={<span className="text-primary">Create New Folder</span>}
                body={
                  <NewFolderPopUp
                    onSave={handleCreateNewFolder}
                    onClose={onClose}
                  />
                }
                footer={({ onClose }) => (
                  <>
                    <div className="w-full h-full flex flex-col justify-end items-start ">
                      <UIButton
                        className="bg-danger text-lg "
                        onClick={onClose}
                      >
                        Cancel
                      </UIButton>
                    </div>
                  </>
                )}
              />
              <UIButton
                color="primary"
                onClick={() => handleSelectFolder(onClose)}
              >
                Select
              </UIButton>
            </div>
          </>
        )}
      />
    </div>
  );
};
export default SavePopUp;
