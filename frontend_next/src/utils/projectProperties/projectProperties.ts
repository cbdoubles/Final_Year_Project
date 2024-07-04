import React, { ChangeEvent } from "react";

/**
 * Handles the change event for a file input element.
 *
 * @param event - The change event from the file input element.
 * @param setSelectedFile - Function to set the selected file.
 * @param setSelectedFileName - Function to set the selected file name.
 */
export const handleFileChange = (
  event: ChangeEvent<HTMLInputElement>,
  setSelectedFile: (file: File) => void,
  setSelectedFileName: (fileName: string) => void
) => {
  const file = event.target.files?.[0];
  if (file) {
    setSelectedFile(file);
    setSelectedFileName(file.name);
  }
};

/**
 * Handles the change event for a file name input element.
 *
 * @param event - The change event from the input element.
 * @param setFileName - Function to set the file name.
 */
export const handleFileNameChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setFileName: (name: string) => void
) => {
  setFileName(event.target.value);
};

