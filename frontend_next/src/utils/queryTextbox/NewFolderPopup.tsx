import React, { useState } from "react";
import { toast } from "react-toastify";

import InputField from "@/src/utils/popUps/InputField";
import UIButton from "@/utils/ui/UIButton";

// Define the props for the NewFolderPopUp component
type NewFolderPopUpProps = {
  onSave: (folderName: string) => void;
  onClose: () => void;
};

/**
 * NewFolderPopUp Component
 *
 * @description
 * This component provides a popup interface for creating a new folder. It allows the user to input a folder name,
 * validates the input, and then triggers the save action. If the folder name is empty, an error is displayed.
 *
 * @props
 * @param {(folderName: string) => void} onSave - Callback function to save the new folder name.
 * @param {() => void} onClose - Callback function to close the popup.
 *
 * @state
 * @typedef {string} folderName - The name of the folder being created, managed with useState.
 */
const NewFolderPopUp: React.FC<NewFolderPopUpProps> = ({ onSave, onClose }) => {
  const [folderName, setFolderName] = useState("");

  /**
   * Handle save action
   *
   * @description
   * This function is triggered when the user clicks the save button. It checks if the folder name is not empty,
   * then calls the onSave and onClose callbacks. If the folder name is empty, an error message is displayed.
   */
  const handleSave = () => {
    if (folderName.trim()) {
      onSave(folderName);
      onClose();
    } else {
      toast.error("Folder name cannot be empty");
    }
  };

  /**
   * Render the component
   *
   * @description
   * Renders the popup interface with an input field for the folder name and a save button.
   */
  return (
    <div data-testid="new-folder-modal">
      <div data-testid="folder-name-project-page-text-field">
        <InputField
          label="Folder Name"
          placeholder="Enter folder name"
          rows={1}
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </div>
      <div className="absolute bottom-4 right-5">
        <UIButton
          data-testid="save-folder-modal-button"
          className="bg-success-700 text-lg"
          onClick={handleSave}
        >
          Save
        </UIButton>
      </div>
    </div>
  );
};

export default NewFolderPopUp;
