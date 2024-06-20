import React, { useCallback, useEffect, useMemo, useState } from "react";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FavouritePopUp from "@/src/views/PopUps/FavoritePopUp";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import NatLangBox from "@/src/utils/NatLangBox";
import { useProps } from "@/src/contexts/PropsContext";
import FileOpenButt from "../ui/FileOpenButt";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { split } from "postcss/lib/list";
import { QueryType } from "@/src/libs/types";
import QueryTextboxAdvanced from "../QueryTextboxAdvanced/QueryTextboxAdvanced";

interface QueryTextboxProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
}

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
  const { natLang, cypherQuery, queryName } = useQueryProps();
  const [boxes, setBoxes] = useState(2);
  const { getSelectedQuery, setQueryFromQuery } = useQueryProps();
  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<QueryType>(
    getSelectedQuery()
  );
  const [editCyphertext, setEditCyphertext] = useState<string>(
    selectedQuery.cypherQuery
  );
  const [saveCyphertext, setSaveCyphertext] = useState<string>(editCyphertext);

  const handleShowCypherQuery = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
    console.log("context query");
    console.log(getSelectedQuery());
    console.log("selected query");
    console.log(selectedQuery);
  };

  const handleInputChange = (placeholder: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [placeholder]: value }));
  };

  const handleError = (onOpen: () => void) => {
    console.log("There is this many boxes:", boxes);
    console.log("----", inputValues);
    if (Object.keys(inputValues).length < boxes) {
      toast.error("Fill in the query text before adding to favourites.", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }
    for (const key in inputValues) {
      if (inputValues[key] === "") {
        toast.error("Fill in the query text before adding to favourites.", {
          position: "bottom-right",
          theme: "colored",
        });
        return;
      }
    }
    onOpen();
  };

  const handleShowQuery = () => {
    // Add logic to show cypher query
  };

  const replaceParametersInQuery = (query: string, params: InputValues) => {
    let resultQuery = query;
    for (const key in params) {
      const realkey = split(key, ["{"], false)[0];
      const regex = new RegExp("\\" + realkey, "g");
      resultQuery = resultQuery.replace(regex, params[key]);
    }
    return resultQuery;
  };

  const handleRunQuery = () => {
    // Generate the JSON output
    const parameters: Record<string, string> = {};

    // Iterate through the input values and populate the parameters object
    for (const key in inputValues) {
      // Extract the part between $ and {
      const match = key.match(/\$(\w+)\{/);
      if (match) {
        const parameterKey = match[1];
        parameters[parameterKey] = inputValues[key];
      }
    }

    const jsonOutput = {
      Parameter: parameters,
      Query: cypherQuery,
    };

    console.log("Generated JSON Output:", jsonOutput);
    const finalQuery = replaceParametersInQuery(cypherQuery, inputValues);
    console.log("Final Cypher Query:", finalQuery); // print the final query with replaced parameters

    setQueryRunTrue();
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="text-md text-black">{"Query: " + queryName}</div>
        <NatLangBox
          dataArray={natLang}
          readOnly={readOnly}
          inputValues={inputValues}
          onInputChange={handleInputChange}
          onCheckValueChange={(checkValue) => {
            setBoxes(checkValue);
          }}
        />
        {!hideButtons && (
          <div className="flex justify-end gap-2 mb-2">
            <UIButton onClick={handleShowCypherQuery}>
              {showReadOnlyTextbox ? "Hide Cypher Query" : "Show Cypher query"}
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
                <UIButton
                  className="bg-gray-500"
                  onClick={() => handleError(onOpen)}
                >
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
                  <FileOpenButt
                    className="bg-success-700 w-full text-lg"
                    onClick={onClose}
                  >
                    Save
                  </FileOpenButt>
                </>
              )}
            ></UIModal>
          </div>
        )}
      </div>
      {showReadOnlyTextbox && (
        <QueryTextboxAdvanced
          readOnly={true}
          initialQuery={"d"}
          hideButtons={true}
        />
      )}
    </div>
  );
};

export default QueryTextbox;
