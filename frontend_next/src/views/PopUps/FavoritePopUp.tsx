import React, { useRef } from "react";
import InputField from "@/src/components/popUps/InputField";
import UIButton from "@/src/utils/ui/UIButton";

type FavouritePopUpProps = {
  onClose?: () => void;
  onOpen?: () => void;
};

const FavouritePopUp: React.FC<FavouritePopUpProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="grid grid-col-1 bg-white">
      <InputField
        label={"Name of the query"}
        rows={8}
        placeholder="Type here"
      />
    </div>
  );
};

export default FavouritePopUp;
