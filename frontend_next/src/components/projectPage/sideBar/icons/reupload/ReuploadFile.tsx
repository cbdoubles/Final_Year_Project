import React, { useRef } from "react";

import UIButton from "@/utils/ui/UIButton";

type ReuploadFileProps = {
  fileName: string;
  onFileNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFileName: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ReuploadFile: React.FC<ReuploadFileProps> = ({
  fileName,
  onFileNameChange,
  selectedFileName,
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div data-testid="start-new-project-modal">
      <label className="block mb-2 text-lg text-black">
        File Name:
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
        <UIButton onClick={handleButtonClick}>Select File</UIButton>
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
