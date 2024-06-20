import React, { useState } from "react";
import InputField from "@/src/components/popUps/InputField";
import UIButton from "../ui/UIButton";
import { toast } from "react-toastify";
import { QueryFolderType } from "@/src/libs/types";

type NewFolderPopUpProps = {
  onSave: (folderName: string) => void;
};

const NewFolderPopUp: React.FC<NewFolderPopUpProps> = ({ onSave }) => {
  const [folderName, setFolderName] = useState("");

  const handleSave = () => {
    if (folderName.trim()) {
      onSave(folderName);
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
