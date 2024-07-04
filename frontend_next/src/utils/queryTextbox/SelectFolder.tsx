import React from "react";

import { QueryFolderType } from "@/src/libs/types";

// Define the props for the SelectFolder component
type SelectProjectProps = {
  folders: QueryFolderType[] | null;
  selectedFolder: QueryFolderType | null;
  setSelectedFolder: (folder: QueryFolderType | null) => void;
};

/**
 * SelectFolder Component
 *
 * @description
 * This component renders a list of folders as options for selection. It allows users to click on a folder to select it,
 * which updates the selectedFolder state in the parent component.
 *
 * @props
 * @param {QueryFolderType[] | null} folders - List of folders to display in the component.
 * @param {QueryFolderType | null} selectedFolder - Currently selected folder.
 * @param {(folder: QueryFolderType | null) => void} setSelectedFolder - Function to set the selected folder when a folder is clicked.
 */
const SelectFolder: React.FC<SelectProjectProps> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
}) => {
  /**
   * Handle folder click
   *
   * @description
   * Updates the selectedFolder state with the clicked folder.
   *
   * @param {QueryFolderType | null} folder - Folder object that was clicked.
   */
  const handleProjectClick = (folder: QueryFolderType | null) => {
    setSelectedFolder(folder);
  };

  /**
   * Render the component
   *
   * @description
   * Renders a list of folders as options for selection. Each folder can be clicked to select it, which visually
   * indicates the selected folder with a background color.
   */
  return (
    <div data-teestid="select-folder-modal">
      {folders &&
        folders.map((folder) => (
          <div
            key={folder.folderId}
            className={`flex justify-between items-center text-black p-2 cursor-pointer ${
              selectedFolder === folder ? "bg-gray-200" : ""
            }`}
            data-testid="select-existing-project-modal"
            onClick={() => handleProjectClick(folder)}
          >
            <span>{folder.folderName}</span>
          </div>
        ))}
    </div>
  );
};

export default SelectFolder;
