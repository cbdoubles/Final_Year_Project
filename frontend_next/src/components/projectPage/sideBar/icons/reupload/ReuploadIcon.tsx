import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-toastify";

import ReuploadFile from "@/src/components/projectPage/sideBar/icons/reupload/ReuploadFile";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { uploadFile } from "@/src/utils/apiCalls/project/handleEditFileProject";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

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
 */

export default function ReuploadIcon({ collapsed }: { collapsed: boolean }) {
  const { projectId } = useProjectProps();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const { setProject } = useProjectProps();

  /**
   * Handles change event on the file input element.
   * Updates the selected file and its name based on user selection.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object containing file input details.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  /**
   * Handles change event on the file name input element.
   * Updates the file name state based on user input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object containing the new file name.
   */
  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  /**
   * Handles save operation for the reuploaded file.
   * Validates input fields and attempts to save the updated file using API call.
   * Displays error message on failure.
   *
   * @param {() => void} onClose - Function to close the modal after save operation.
   */
  const handleSave = async (onClose: () => void) => {
    if (!selectedFile || !fileName) return;

    try {
      const project = await uploadFile(projectId, selectedFile, fileName);
      setProject(project);
    } catch (error) {
      toast.error("Error saving project");
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
            onFileChange={handleFileChange}
            onFileNameChange={handleFileNameChange}
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
              <UIButton onClick={() => handleSave(onClose)}>Save</UIButton>
            )}
          </>
        )}
        header={<p className="text-primary">Select File</p>}
      ></UIModal>
    </div>
  );
}
