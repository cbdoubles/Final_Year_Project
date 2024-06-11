import React, { useState } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FavouritePopUp from "@/src/views/PopUps/FavoritePopUp";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import NatLangBox from "@/src/utils/NatLangBox";
import { useProps } from "@/src/contexts/PropsContext";

interface QueryTextboxProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
}

const dataArray: string[] = [
  "Match the actor",
  "$actorname:str$",
  "to all the movies they did.",
];

interface InputValues {
  [key: string]: string;
}


const QueryTextbox: React.FC<QueryTextboxProps> = ({
  readOnly = false,
  initialQuery = "",
  hideButtons = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const { queryRunClicked, setQueryRunTrue } = useProps();
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (placeholder: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [placeholder]: value }));
  };

  const handleAddToFavourites = (onOpen: () => void) => {
    for (const key in inputValues) {
      if (inputValues[key] === "") {
        setError("Please fill in all input fields before adding to favourites.");
        return;
      }
    }
    onOpen();
  };


  const handleShowQuery = () => {
    // Add logic to show cypher query
    alert(`Cypher Query: ${query}`);
  };

  const handleRunQuery = () => {
    // Add logic to run the query
    console.log("Run query - input values:", inputValues);
    setQueryRunTrue();
  };

  return (
    <div className="flex flex-col">
      <NatLangBox
        dataArray={dataArray}
        inputValues={inputValues}
        onInputChange={handleInputChange}
      />
      {!hideButtons && (
        <div className="flex justify-end gap-2 mb-2">
          <UIButton
            onClick={handleShowQuery}
            disabled={readOnly}
            className="bg-primary"
          >
            Show Cypher
          </UIButton>
          <UIButton
            onClick={handleRunQuery}
            disabled={readOnly}
            className="bg-success-700"
          >
            Run
          </UIButton>
          <UIModal
            button={({ onOpen }) => (
              <UIButton className="bg-gray-500" onClick={() => handleAddToFavourites(onOpen)}>
                <FontAwesomeIcon icon={faStar} className="w-6" />
                <p>Add to Favorites</p>
              </UIButton>
            )}
            header={<span className="text-primary">Save favorite query</span>}
            body={<FavouritePopUp></FavouritePopUp>}
            footer={({ onClose }) => (
              <>
                <UIButton
                  className=" bg-danger w-full text-lg"
                  onClick={onClose}
                >
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
      )}
    </div>
  );
};

export default QueryTextbox;
