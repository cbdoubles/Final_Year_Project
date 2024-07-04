import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

import UIButton from "../../utils/ui/UIButton";

import { useProjectProps } from "@/src/contexts/ProjectContext";
import handleSaveProject from "@/src/utils/apiCalls/project/handleSaveProject";
import {
  handleFileChange,
  handleFileNameChange,
} from "@/utils/projectProperties/projectProperties";

type StartNewProjectProps = {};

/**
 * StartNewProject Component
 *
 * @description
 * This component provides a form interface for starting a new project. It allows users to input a project name,
 * select and upload a file, and save the new project. It handles file selection, input validation, and error
 * handling during project save operations.
 *
 * @props
 * No props are passed directly to this component.
 *
 * @state
 * @typedef {File | null} selectedFile - State to store the selected file for upload.
 * @typedef {string | null} selectedFileName - State to store the name of the selected file.
 * @typedef {string} fileName - State to store the input value for the file name.
 * @typedef {string} newProjectName - State to store the input value for the new project name.
 * @typedef {boolean} isLoading - State to store the loading status during save operation.
 */

const StartNewProject: React.FC<StartNewProjectProps> = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setProject } = useProjectProps();

  /**
   * Handles click event on the "Select File" button.
   * Triggers the file input to open for file selection.
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles change event on the project name input element.
   * Updates the new project name state based on user input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object containing the new project name.
   */
  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewProjectName(event.target.value);
  };

  /**
   * Handles save operation for the new project.
   * Validates input fields and attempts to save the project using API call.
   * Displays error message on failure.
   */
  const handleSave = async () => {
    if (!selectedFile || !fileName || !newProjectName) return;
    setIsLoading(true);
    try {
      const project = await handleSaveProject(
        selectedFile,
        fileName,
        newProjectName
      );
      setProject(project);
      router.push("/projectpage");
    } catch (error) {
      toast.error("Error saving project");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Determines if the Save button should be disabled based on input validation.
   */
  const isSaveDisabled = !selectedFile || !fileName || !newProjectName;

  return (
    <>
      <div data-testid="start-new-project-modal">
        <label className="block mb-2 text-lg text-black">
          Project Name:
          <input
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="text"
            value={newProjectName}
            onChange={handleProjectNameChange}
          />
        </label>
        <label className="block mb-2 text-lg text-black">
          File Name:
          <input
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            data-testid="file-name-text-field"
            type="text"
            value={fileName}
            onChange={(event) => handleFileNameChange(event, setFileName)}
          />
        </label>
        {selectedFileName && (
          <div className="mt-4 text-gray-700">
            <strong>Selected file:</strong> {selectedFileName}
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <UIButton
            data-testid="select-file-upload"
            onClick={handleButtonClick}
          >
            Select File
          </UIButton>
          <input
            ref={fileInputRef}
            accept=".json, .graphml"
            style={{ display: "none" }}
            type="file"
            onChange={(event) =>
              handleFileChange(event, setSelectedFile, setSelectedFileName)
            }
          />
          {!isSaveDisabled && (
            <UIButton onClick={handleSave}>
              {isLoading ? "Saving..." : "Save"}
            </UIButton>
          )}
        </div>
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default StartNewProject;
