import React, { useState } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FavouritePopUp from "@/src/views/PopUps/FavoritePopUp";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import NatLangBox from "@/src/utils/NatLangBox";
import { useProps } from "@/src/contexts/PropsContext";
import QueryTextboxAdvanced from "../QueryTextboxAdvanced/QueryTextboxAdvanced";
import { HARDCODED_CYPHER_QUERY } from "./hardcodedQuery";

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

interface QueryTextboxProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
}

const QueryTextbox: React.FC<QueryTextboxProps> = ({
  readOnly = false,
  initialQuery = "",
  hideButtons = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const { queryRunClicked, setQueryRunTrue } = useProps();
  const [showAdvancedTextbox, setShowAdvancedTextbox] = useState(false);

  const [inputValues, setInputValues] = useState<InputValues>({});

  const handleInputChange = (placeholder: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [placeholder]: value }));
  };

  const handleShowQuery = () => {
    setShowAdvancedTextbox((prev) => !prev);
    if (!showAdvancedTextbox) {
      setQuery(HARDCODED_CYPHER_QUERY);
    }
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
            {showAdvancedTextbox ? "Hide Cypher" : "Show Cypher"}
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
              <UIButton className="bg-gray-500" onClick={onOpen}>
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
      {showAdvancedTextbox && (
        <QueryTextboxAdvanced
          initialQuery={HARDCODED_CYPHER_QUERY}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default QueryTextbox;
