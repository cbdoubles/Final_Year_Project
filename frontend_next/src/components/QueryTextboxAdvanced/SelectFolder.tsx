import React from "react";
import { QueryFolderType } from "@/src/libs/types";

type SelectProjectProps = {
  folders: QueryFolderType[] | null;
  selectedFolder: QueryFolderType | null;
  setSelectedFolder: (folder: QueryFolderType | null) => void;
};

const SelectFolder: React.FC<SelectProjectProps> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
}) => {
  console.log("Folders passed to SelectFolder:", folders);

  const handleProjectClick = (folder: QueryFolderType | null) => {
    setSelectedFolder(folder);
  };

  return (
    <div>
      {folders &&
        folders.map((folder) => (
          <div
            key={folder.folderId}
            data-testid="select-existing-project-modal"
            className={`flex justify-between items-center text-black p-2 cursor-pointer ${
              selectedFolder === folder ? "bg-gray-200" : ""
            }`}
            onClick={() => handleProjectClick(folder)}
          >
            <span>{folder.folderName}</span>
          </div>
        ))}
    </div>
  );
};

export default SelectFolder;
