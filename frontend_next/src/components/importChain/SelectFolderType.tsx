import React, { useState } from "react";
import UIModal from "@/src/components/ui/UIModal";
import UIButton from "@/src/components/ui/UIButton";
import { FolderType, ProjectType } from "@/src/libs/types";
import ImportQueryFolders from "./ImportQueryFolders";
import { toast } from "react-toastify";

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

  const handleSelectProject = (onOpen: () => void) => {
    if (selectedProject) {
      onOpen();
    }
  };

  const onCloseResetFolder = (onClose: () => void) => {
    if (selectedFolderType) {
      setSelectedFolderType(null);
      onClose();
    } else {
      toast.error("No folder type selected");
    }
  };

  return (
    <div>
      <UIModal
        button={({ onOpen }) => (
          <UIButton color="primary" onClick={() => handleSelectProject(onOpen)}>
            Select
          </UIButton>
        )}
        header={<p className="text-primary">Select Type</p>}
        body={
          <div>
            {folderTypes &&
              folderTypes.map((folder) => (
                <div
                  key={folder}
                  data-testid="select-existing-project-modal"
                  className={`flex justify-between items-center text-black p-2 cursor-pointer ${
                    selectedFolderType === folder ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedFolderType(folder)}
                >
                  <span>{folder !== null ? folder.toString() : "test"}</span>
                </div>
              ))}
          </div>
        }
        footer={({ onClose }) => (
          <ImportQueryFolders
            type={selectedFolderType}
            projectId={projectId}
            onCloseSelectFolder={() => onCloseResetFolder(onClose)}
            onCloseChooseProject={onCloseChooseProject}
          />
        )}
      ></UIModal>
    </div>
  );
}
