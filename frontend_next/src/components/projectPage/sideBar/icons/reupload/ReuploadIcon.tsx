import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-toastify";

import ReuploadFile from "@/src/components/projectPage/sideBar/icons/reupload/ReuploadFile";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { uploadFile } from "@/src/utils/apiCalls/project/handleEditFileProject";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

export default function ReuploadIcon({ collapsed }: { collapsed: boolean }) {
  const { projectId } = useProjectProps();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const { setProject } = useProjectProps();

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
            data-testid="ui-button"
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
