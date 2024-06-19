import React, { useState } from "react";
import InputField from "@/src/components/popUps/InputField";
import UIButton from "../ui/UIButton";
import { toast } from "react-toastify";
import { QueryFolderType } from "@/src/libs/types";

type NewFolderPopUpProps = {
  onSave: (folderName: string) => void;
  onClose: () => void;
};

const NewFolderPopUp: React.FC<NewFolderPopUpProps> = ({ onSave, onClose }) => {
  const [folderName, setFolderName] = useState("");

  const handleSave = () => {
    if (folderName.trim()) {
      onSave(folderName);
      onClose();
    } else {
      toast.error("Folder name cannot be empty");
    }
  };

  return (
    <div>
      <InputField
        rows={1}
        label="Folder Name"
        placeholder="Enter folder name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
      <div className="w-full flex justify-between mt-4 mb-4">
        <UIButton className="bg-success-700 text-lg ml-2" onClick={handleSave}>
          Save
        </UIButton>
        <UIButton className="bg-danger text-lg mr-2" onClick={onClose}>
          Cancel
        </UIButton>
      </div>
    </div>
  );
};

export default NewFolderPopUp;
