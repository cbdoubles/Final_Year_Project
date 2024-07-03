import React, { useRef } from "react";

import UIButton from "@/utils/ui/UIButton";

type ReuploadFileProps = {
  fileName: string;
  onFileNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFileName: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * ReuploadFile Component
 *
 * @description
 * This component provides a file re-upload interface. It allows users to input a file name, select a file for upload,
 * and displays the selected file name if available. It triggers file selection dialog on button click and handles
 * file name and file selection change events.
 *
 * @props
 * @param {string} fileName - Current file name displayed in the input field.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} onFileNameChange - Function to handle file name input change.
 * @param {string | null} selectedFileName - Name of the currently selected file (null if no file selected).
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} onFileChange - Function to handle file selection change.
 *
 * @state
 * No additional state managed within this component.
 */
const ReuploadFile: React.FC<ReuploadFileProps> = ({
  fileName,
  onFileNameChange,
  selectedFileName,
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Handles click event on the "Select File" button.
   * Triggers the file input to open for file selection.
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div data-testid="reupload-data-modal">
      <label className="block mb-2 text-lg text-black">
        File Name:
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          data-testid="reupload-file-name-text-field"
          type="text"
          value={fileName}
          onChange={onFileNameChange}
        />
      </label>
      {selectedFileName && (
        <div className="mt-4 text-gray-700">
          <strong>Selected file:</strong> {selectedFileName}
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <UIButton
          data-testid="select-file-reupload"
          onClick={handleButtonClick}
        >
          Select File
        </UIButton>
        <input
          ref={fileInputRef}
          accept=".json, .graphml"
          style={{ display: "none" }}
          type="file"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};

export default ReuploadFile;
