import React, { useState } from "react";
import { toast } from "react-toastify";

import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";

import NewFolderPopUp from "./NewFolderPopup";
import SelectFolder from "./SelectFolder";

import { useProjectProps } from "@/src/contexts/ProjectContext";
import { QueryFolderType, FolderType } from "@/src/libs/types";
import { fetchFolders } from "@/src/utils/apiCalls/folder/fetchFolders";
import { handleSaveFolder } from "@/src/utils/apiCalls/folder/handleSaveFolder";
import InputField from "@/src/utils/popUps/InputField";

// Define the props for the SavePopUp component
type SavePopUpProps = {
  fav?: boolean;
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

/**
 * SavePopUp Component
 *
 * @description
 * This component provides a popup interface for saving queries. It includes input fields for query name, cyphertext,
 * and natural language, as well as options to select or create folders for organizing saved queries.
 *
 * @props
 * @param {boolean} [fav] - Flag indicating whether the popup is for saving to favorites.
 * @param {string} queryName - Current query name displayed in the input field.
 * @param {string} cyphertext - Current cyphertext displayed in the input field.
 * @param {string} natLang - Current natural language representation displayed in the input field.
 * @param {QueryFolderType | null} selectedFolder - Currently selected folder for saving the query.
 * @param {FolderType} folderType - Type of folder (e.g., Favorite, Regular).
 * @param {(newFolderName: string) => void} updateQueryName - Function to update the query name.
 * @param {(newCyphertext: string) => void} updateCyphertext - Function to update the cyphertext.
 * @param {(newNaturalLanguage: string) => void} updateNaturalLanguage - Function to update the natural language representation.
 * @param {(folder: QueryFolderType | null) => void} setSelectedFolder - Function to set the selected folder.
 *
 * @state
 * @typedef {QueryFolderType[] | null} folders - State to store fetched folders from the API.
 */
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

  /**
   * Handle change in query name input
   *
   * @description
   * Updates the query name state with the new value from the input field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event object containing the new value.
   */
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryName(e.target.value);
  };

  /**
   * Handle change in cyphertext input
   *
   * @description
   * Updates the cyphertext state with the new value from the input field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event object containing the new value.
   */
  const handleCyphertext = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCyphertext(e.target.value);
  };

  /**
   * Handle change in natural language representation input
   *
   * @description
   * Updates the natural language representation state with the new value from the input field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event object containing the new value.
   */
  const handleNatLang = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNaturalLanguage(e.target.value);
  };

  /**
   * Handle select folder action
   *
   * @description
   * Closes the modal if a folder is already selected. Otherwise, displays an error message.
   *
   * @param {() => void} onClose - Callback function to close the modal.
   */
  const handleSelectFolder = async (onClose: () => void) => {
    if (selectedFolder) {
      onClose();
    } else {
      toast.error("No folder selected");
    }
  };

  /**
   * Open select folder modal
   *
   * @description
   * Fetches folders from the API based on the project ID and folder type. If successful, updates the folders state
   * and opens the select folder modal. Otherwise, displays an error message.
   *
   * @param {() => void} onOpen - Callback function to open the modal.
   */
  const openSelectFolder = async (onOpen: () => void) => {
    const result = await fetchFolders(projectId, folderType);
    if (result) {
      setFolders(result);
      onOpen();
    } else {
      toast.error("No folder selected");
    }
  };

  /**
   * Handle create new folder action
   *
   * @description
   * Calls the API to create a new folder with the given name and updates the folders state with the new folder.
   *
   * @param {string} folderName - Name of the new folder to be created.
   */
  const handleCreateNewFolder = async (folderName: string) => {
    const newFolder = await handleSaveFolder(folderName, folderType, projectId);

    if (newFolder) {
      setFolders([...(folders || []), newFolder]);
      setSelectedFolder(newFolder);
    }
  };

  /**
   * Render the component
   *
   * @description
   * Renders the popup interface with input fields for query name, cyphertext, and natural language representation,
   * as well as options to select or create folders for organizing saved queries.
   */
  return (
    <div data-testid="save-pop-up-modal">
      <InputField
        label="Query name"
        placeholder="Type here"
        rows={2}
        value={queryName}
        onChange={handleChangeName}
        data-testid="query-name-text-field"
      />
      <InputField
        label="Cyphertext representation"
        placeholder="Type here"
        readOnly={fav ? true : false}
        rows={4}
        value={cyphertext}
        onChange={handleCyphertext}
        data-testid="cypher-trepresentation-text-field"
      />
      <InputField
        // readOnly={fav ? true : false}
        label="Natural language representation"
        placeholder="Type here"
        rows={4}
        value={natLang}
        onChange={handleNatLang}
      />
      <label className="text-black text-sm block mb-2">Select folder</label>
      <UIModal
        body={
          <div>
            <SelectFolder
              folders={folders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />
          </div>
        }
        button={({ onOpen }) => (
          <UIButton
            data-testid="ui-button"
            onClick={() => openSelectFolder(onOpen)}
          >
            {selectedFolder ? selectedFolder.folderName : "Select folder"}
          </UIButton>
        )}
        footer={({ onClose }) => (
          <>
            <div className="w-full flex justify-between mt-4 text-black">
              <UIModal
                body={
                  <NewFolderPopUp
                    onClose={onClose}
                    onSave={handleCreateNewFolder}
                  />
                }
                button={({ onOpen }) => (
                  <UIButton className="bg-success-700" onClick={onOpen}>
                    Create New Folder
                  </UIButton>
                )}
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
                header={<span className="text-primary">Create New Folder</span>}
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
        header={<p className="text-primary">select folder</p>}
      />
    </div>
  );
};
export default SavePopUp;
