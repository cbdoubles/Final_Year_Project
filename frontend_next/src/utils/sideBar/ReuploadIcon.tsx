import React, { useState } from "react";
import ReuploadFile from "@/src/components/sideBar/ReuploadFile";
import UIButton from "@/src/components/ui/UIButton";
import UIModal from "@/src/components/ui/UIModal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import Link from "next/link";

const properties = {
  name: "Reupload project data",
  href: "/sideBar",
  icon: ArrowPathIcon,
};

export default function ReuploadIcon({ collapsed }: { collapsed: boolean }) {
  const { projectId } = useProjectProps();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

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

  const handleSave = async (onClose: () => void) => {
    if (!selectedFile || !fileName) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_name", fileName);

    try {
      const response = await fetch(
        `http://localhost:8000/api/projects/${projectId}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await response.json();
      setMessage(result.message || result.error);

      if (response.ok) {
        console.log("File saved:", selectedFileName);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file");
    }
    onClose();
  };

  const isSaveDisabled = !selectedFile || !fileName;

  return (
    <div>
      <UIModal
        button={({ onOpen }) => (
          <button
            data-testid="ui-button"
            className="w-full flex relative h-[48px] grow items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
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
        header={<p className="text-primary">Select File</p>}
        body={
          <ReuploadFile
            fileName={fileName}
            onFileNameChange={handleFileNameChange}
            selectedFileName={selectedFileName}
            onFileChange={handleFileChange}
          />
        }
        footer={({ onClose }) => (
          <>
            {!isSaveDisabled && (
              <UIButton onClick={() => handleSave(onClose)}>Save</UIButton>
            )}
          </>
        )}
      ></UIModal>
      {message && <p>{message}</p>}
    </div>
  );
}
