import React, { useRef, useState } from "react";
import UIButton from "../ui/UIButton";
import { useRouter } from "next/router";

type SelectFileProps = {};

const SelectFile: React.FC<SelectFileProps> = ({}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectName(event.target.value);
  };

  const handleSave = async () => {
    if (!selectedFile || !fileName || !projectName) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_name", fileName);
    formData.append("name", projectName);

    try {
      const response = await fetch(`http://localhost:8000/api/project/`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || result.error);

      if (response.ok) {
        console.log("File saved:", selectedFileName);
        router.push("/projectpage");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file");
    }
  };

  const isSaveDisabled = !selectedFile || !fileName || !projectName;

  return (
    <>
      <div data-testid="start-new-project-modal">
        <label className="block mb-2 text-lg text-black">
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={handleProjectNameChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
        <label className="block mb-2 text-lg text-black">
          File Name:
          <input
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
        {selectedFileName && (
          <div className="mt-4 text-gray-700">
            <strong>Selected file:</strong> {selectedFileName}
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <UIButton onClick={handleButtonClick}>Select File</UIButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".json, .graphml"
            onChange={handleFileChange}
          />
          {!isSaveDisabled && <UIButton onClick={handleSave}>Save</UIButton>}
        </div>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default SelectFile;
