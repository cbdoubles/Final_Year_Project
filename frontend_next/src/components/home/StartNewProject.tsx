import React, { useRef, useState } from "react";
import UIButton from "../ui/UIButton";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { ProjectType } from "@/src/libs/types";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { use } from "cytoscape";
import handleSaveProject from "@/utils/home/selectExistingProject/handleSaveProject";

type SelectFileProps = {};

const SelectFile: React.FC<SelectFileProps> = ({}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { setProject } = useProjectProps();

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
    setNewProjectName(event.target.value);
  };

  const handleSave = async () => {
    if (!selectedFile || !fileName || !newProjectName) return;

    try {
      const project = await handleSaveProject(
        selectedFile,
        fileName,
        newProjectName
      );
      setProject(project);
      router.push("/projectpage");
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const isSaveDisabled = !selectedFile || !fileName || !newProjectName;

  return (
    <>
      <div data-testid="start-new-project-modal">
        <label className="block mb-2 text-lg text-black">
          Project Name:
          <input
            type="text"
            value={newProjectName}
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
