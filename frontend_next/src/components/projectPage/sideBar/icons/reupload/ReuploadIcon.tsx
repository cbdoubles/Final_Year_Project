import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-toastify";

import ReuploadFile from "@/src/components/projectPage/sideBar/icons/reupload/ReuploadFile";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { uploadFile } from "@/src/utils/apiCalls/project/handleEditFileProject";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";
import {
  handleFileChange,
  handleFileNameChange,
} from "@/utils/projectProperties/projectProperties";

/**
 * ReuploadIcon Component
 *
 * @description
 * This component renders an icon with a modal interface for re-uploading a file associated with a project.
 * It allows users to select a new file and update the existing file for the project.
 *
 * @props
 * @param {boolean} collapsed - Flag indicating whether the component is in a collapsed state (not used directly by this component).
 *
 * @state
 * @typedef {File | null} selectedFile - State to store the selected file for upload.
 * @typedef {string | null} selectedFileName - State to store the name of the selected file.
 * @typedef {string} fileName - State to store the input value for the file name.
 * @typedef {boolean} isLoading - State to store the loading status during save operation.
 */

export default function ReuploadIcon({ collapsed }: { collapsed: boolean }) {
  const { projectId } = useProjectProps();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setProject } = useProjectProps();

  /**
   * Handles save operation for the reuploaded file.
   * Validates input fields and attempts to save the updated file using API call.
   * Displays error message on failure.
   *
   * @param {() => void} onClose - Function to close the modal after save operation.
   */
  const handleSave = async (onClose: () => void) => {
    if (!selectedFile || !fileName) return;

    setIsLoading(true);
    try {
      const project = await uploadFile(projectId, selectedFile, fileName);
      setProject(project);
    } catch (error) {
      toast.error("Error saving project");
    } finally {
      setIsLoading(false);
    }

    onClose();
  };

  const isSaveDisabled = !selectedFile || !fileName;

  return (
    <div>
      <UIModal
        body={
          <ReuploadFile
            fileName={fileName}
            selectedFileName={selectedFileName}
            onFileChange={(event) =>
              handleFileChange(event, setSelectedFile, setSelectedFileName)
            }
            onFileNameChange={(event) =>
              handleFileNameChange(event, setFileName)
            }
          />
        }
        button={({ onOpen }) => (
          <button
            className="w-full flex relative h-[48px] grow items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
            data-testid="reupload-button"
            onClick={onOpen}
          >
            <ArrowPathIcon className="w-6" />
            {!collapsed && (
              <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
                Reupload
              </p>
            )}
          </button>
        )}
        footer={({ onClose }) => (
          <>
            {!isSaveDisabled && (
              <UIButton onClick={() => handleSave(onClose)}>
                {isLoading ? "Saving..." : "Save"}
              </UIButton>
            )}
            {isLoading && (
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
              </div>
            )}
          </>
        )}
        header={<p className="text-primary">Select File</p>}
      ></UIModal>
    </div>
  );
}
