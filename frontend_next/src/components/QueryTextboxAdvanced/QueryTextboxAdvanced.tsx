import React, { useState } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import FavouritePopUp from "@/src/views/PopUps/FavoritePopUp";
import CustomPopUp from "@/src/views/PopUps/CustomPopUp";
import QueryTextbox from "../queryTextbox/QueryTextbox";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";

const QueryTextboxAdvanced: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);

  const handleShowNaturalLang = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  const handleRunQuery = () => {
    console.log("Running query:", query);
  };

  return (
    <div className="flex flex-col h-full w-full">
        <iframe
          src="http://localhost:3001"
          width="90%"
          height="300vh"
        ></iframe>
      <div className="flex justify-end gap-2 mb-2 mt-5  ">
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
        <QueryTextbox readOnly={true} initialQuery={query} hideButtons={true} />
      )}
    </div>
  );
};

export default QueryTextboxAdvanced;
