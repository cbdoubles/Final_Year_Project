import React, { useState } from "react";
import { toast } from "react-toastify";

import ImportQueryFolders from "./ImportQueryFolders";

import { FolderType, ProjectType } from "@/src/libs/types";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

/**
 * SelectFolderType Component
 *
 * @description
 * This component renders a modal for selecting a folder type and project. It provides functionality
 * to select a folder type from a list and then open a modal to import query folders.
 *
 * @props
 * @param {number} projectId - The ID of the current project.
 * @param {() => void} onCloseChooseProject - Function to handle closing the project selection modal.
 * @param {FolderType[]} folderTypes - Array of available folder types to select from.
 * @param {ProjectType | null} selectedProject - The currently selected project.
 */
export default function SelectFolderType({
  projectId,
  onCloseChooseProject,
  folderTypes,
  selectedProject,
}: {
  projectId: number;
  onCloseChooseProject: () => void;
  folderTypes: FolderType[];
  selectedProject: ProjectType | null;
}) {
  const [selectedFolderType, setSelectedFolderType] =
    useState<FolderType | null>(null);

  /**
   * Handle select project action
   *
   * @description
   * Opens the modal for selecting a project if a project is already selected.
   *
   * @param {() => void} onOpen - Callback function to open the modal.
   */
  const handleSelectProject = (onOpen: () => void) => {
    if (selectedProject) {
      onOpen();
    }
  };

  /**
   * Handle close and reset folder action
   *
   * @description
   * Resets the selected folder type and closes the modal. Displays an error message if no folder type is selected.
   *
   * @param {() => void} onClose - Callback function to close the modal.
   */
  const onCloseResetFolder = (onClose: () => void) => {
    if (selectedFolderType) {
      setSelectedFolderType(null);
      onClose();
    } else {
      toast.error("No folder type selected");
    }
  };

  /**
   * Render the component
   *
   * @description
   * Renders the modal for selecting folder type and project. It includes a button to open the project selection modal,
   * a list of folder types to choose from, and the ImportQueryFolders component in the footer.
   *
   * @returns {JSX.Element} The rendered modal component.
   */
  return (
    <div>
      <UIModal
        body={
          <div>
            {folderTypes &&
              folderTypes.map((folder) => (
                <div
                  key={folder}
                  className={`flex justify-between items-center text-black p-2 cursor-pointer ${
                    selectedFolderType === folder ? "bg-gray-200" : ""
                  }`}
                  data-testid="select-existing-project-modal"
                  onClick={() => setSelectedFolderType(folder)}
                >
                  <span>{folder !== null ? folder.toString() : "test"}</span>
                </div>
              ))}
          </div>
        }
        button={({ onOpen }) => (
          <UIButton color="primary" onClick={() => handleSelectProject(onOpen)}>
            Select
          </UIButton>
        )}
        footer={({ onClose }) => (
          <ImportQueryFolders
            projectId={projectId}
            type={selectedFolderType}
            onCloseChooseProject={onCloseChooseProject}
            onCloseSelectFolder={() => onCloseResetFolder(onClose)}
          />
        )}
        header={<p className="text-primary">Select Type</p>}
      ></UIModal>
    </div>
  );
}
