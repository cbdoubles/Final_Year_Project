import React, { useState, useRef } from "react";
import QueryTextbox from "../QueryTextbox/QueryTextbox";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import FavouritePopUp from "@/src/views/PopUps/FavoritePopUp";
import CustomPopUp from "@/src/views/PopUps/CustomPopUp";
import { Card } from "@nextui-org/react";
import NeovisComponent from "../neovisGraph/NeovisComponent";

interface QueryTextboxAdvancedProps {
  setQuery: (query: string) => void;
}

const QueryTextboxAdvanced: React.FC<QueryTextboxAdvancedProps> = ({
  setQuery,
}) => {
  const [localQuery, setLocalQuery] = useState("");
  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);
  const [queryRunClicked, setQueryRunClicked] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  const handleRunQuery = () => {
    const query = inputRef.current?.value || "";
    console.log("Running query:", query);
    setLocalQuery(query);
    setQuery(query);
    setQueryRunClicked(true); // Initialize the NeovisComponent
  };

  return (
    <div className="flex flex-col w-full">
      <textarea
        ref={inputRef}
        className="w-full h-20 p-2 text-lg border rounded border-gray-300 mb-2 resize-none text-black"
        defaultValue={localQuery}
        placeholder="Enter your query here"
      />
      <div className="flex justify-end gap-2 mb-2">
        <UIButton onClick={handleShowNaturalLang}>Show Natural Lang</UIButton>
        <UIButton className="bg-success-700" onClick={handleRunQuery}>
          Run
        </UIButton>
        <UIModal
          button={({ onOpen }) => (
            <UIButton className="bg-gray-500" onClick={onOpen}>
              <FontAwesomeIcon icon={faStar} className="w-6" />
              Add to Favorites
            </UIButton>
          )}
          header={<span className="text-primary">Save favorite query</span>}
          body={<FavouritePopUp></FavouritePopUp>}
          footer={({ onClose }) => (
            <>
              <UIButton className=" bg-danger w-full text-lg" onClick={onClose}>
                Cancel
              </UIButton>
              <UIButton
                className="bg-success-700 w-full text-lg"
                onClick={onClose}
              >
                Save
              </UIButton>
            </>
          )}
        ></UIModal>
        <UIModal
          button={({ onOpen }) => (
            <UIButton className="bg-gray-500" onClick={onOpen}>
              <FontAwesomeIcon icon={faStar} className="w-6" />
              Add to Customs
            </UIButton>
          )}
          header={<span className="text-primary">Save custom query</span>}
          body={<CustomPopUp></CustomPopUp>}
          footer={({ onClose }) => (
            <>
              <UIButton className=" bg-danger w-full text-lg" onClick={onClose}>
                Cancel
              </UIButton>
              <UIButton
                className="bg-success-700 w-full text-lg"
                onClick={onClose}
              >
                Save
              </UIButton>
            </>
          )}
        ></UIModal>
      </div>
      {showReadOnlyTextbox && (
        <QueryTextbox
          readOnly={true}
          initialQuery={localQuery}
          hideButtons={true}
        />
      )}
    </div>
  );
};

export default QueryTextboxAdvanced;
