import React, { useState } from "react";
import InputField from "@/src/utils/popUps/InputField";
import UIButton from "@/utils/ui/UIButton";
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
      <div className="absolute bottom-4 right-5">
        <UIButton className="bg-success-700 text-lg" onClick={handleSave}>
          Save
        </UIButton>
      </div>
    </div>
  );
};

export default NewFolderPopUp;
