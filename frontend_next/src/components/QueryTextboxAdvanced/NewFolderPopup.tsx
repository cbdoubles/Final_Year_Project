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
      <UIButton className="bg-success-700 w-full text-lg" onClick={handleSave}>
        Save
      </UIButton>
    </div>
  );
};

export default NewFolderPopUp;
