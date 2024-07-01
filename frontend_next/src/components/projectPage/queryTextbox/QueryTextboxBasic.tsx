import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import UIButton from "../../../utils/ui/UIButton";
import UIModal from "../../../utils/ui/UIModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import FavouritePopUp from "@/src/views/PopUps/FavoritePopUp";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import NatLangBox from "@/src/utils/queryTextbox/NatLangBox";
import { useProps } from "@/src/contexts/PropsContext";
// import FileOpenButt from "../../utils/ui/FileOpenButt";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { split } from "postcss/lib/list";
import { QueryFolderType, QueryType } from "@/src/libs/types";
import QueryTextboxAdvanced from "./QueryTextboxAdvanced";
import SavePopUp from "../../../utils/queryTextbox/SavePopUp";
import { handleSaveQuery } from "@/utils/apiCalls/query/handleSaveQuery";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { validateParameters } from "@/src/utils/parameterUtils";

interface QueryTextboxBasicProps {
  readOnly?: boolean;
  initialQuery?: string;
  hideButtons?: boolean;
  setQueryToRun?: (query: string) => void;
}

const folderType = "Favorite";

interface InputValues {
  [key: string]: string;
}

const QueryTextboxBasic: React.FC<QueryTextboxBasicProps> = ({
  readOnly = false,
  initialQuery = "",
  hideButtons = false,
  setQueryToRun,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const { queryRunClicked, setQueryRunTrue } = useProps();
  const [inputValues, setInputValues] = useState<InputValues>({});
  const { updatedQuery, natLang, cypherQuery, queryName } = useQueryProps();
  const [boxes, setBoxes] = useState(0);
  const { getSelectedQuery, setQueryFromQuery } = useQueryProps();
  const [showReadOnlyTextbox, setShowReadOnlyTextbox] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<QueryType>(
    getSelectedQuery()
  );
  // const [editCyphertext] = useState<string>(selectedQuery.cypherQuery);
  // const [saveNatLang] = useState<string>(selectedQuery.natLang);
  const [saveCyphertext, setSaveCyphertext] = useState<string>(
    selectedQuery.cypherQuery
  );
  const [saveNatLang, setSaveNatLang] = useState<string>(selectedQuery.natLang);
  const [selectedFolder, setSelectedFolder] = useState<QueryFolderType | null>(
    null
  );

  useEffect(() => {
    setSelectedQuery(updatedQuery);
    setSaveCyphertext(cypherQuery);
    setSaveQueryName(queryName);
    setSaveNatLang(natLang);
  }, [updatedQuery]);

  const { projectId } = useProjectProps();

  const saveChooseFolder = () => {
    console.log("clicked save");
  };

  const [saveQueryName, setSaveQueryName] = useState<string>(
    selectedQuery.queryName
  );

  // const openSave = async (onOpen: () => void) => {
  //   setSelectedFolder(null);
  //   setSaveCyphertext(editCyphertext);
  //   onOpen();
  // };

  const handleShowCypherQuery = () => {
    setShowReadOnlyTextbox((prevState) => !prevState);
  };

  const handleInputChange = (placeholder: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [placeholder]: value }));
  };

  const handleSaveFavorites = (onOpen: () => void) => {
    if (handleError()) {
      setSaveCyphertext(
        replaceParametersInCypherQuery(saveCyphertext, inputValues)
      );
      setSaveNatLang(
        replaceNaturalLanguageParameters(saveNatLang, inputValues)
      );
      console.log(saveCyphertext);
      console.log(saveNatLang);
      onOpen();
      onOpen();
    }
  };

  const handleError = (): boolean => {
    console.log("There is this many boxes:", boxes);
    console.log("----", inputValues);
    if (natLang === "") {
      toast.error("No query selected", {
        position: "bottom-right",
        theme: "colored",
      });
      return false;
    }
    if (Object.keys(inputValues).length < boxes) {
      toast.error("Fill in the query text before proceeding.", {
        position: "bottom-right",
        theme: "colored",
      });
      return false;
    }
    for (const key in inputValues) {
      if (inputValues[key] === "") {
        toast.error("Fill in the query text before proceeding.", {
          position: "bottom-right",
          theme: "colored",
        });
        return false;
      }
    }
    return true;
  };

  const replaceNaturalLanguageParameters = (
    query: string,
    params: InputValues
  ) => {
    const regex = /\$(\w+)\{(\w+):(\w+)\}/g;
    let resultQuery = query;
    let match;

    while ((match = regex.exec(query)) !== null) {
      const [placeholder, variable, type, key] = match;
      if (params.hasOwnProperty(variable)) {
        resultQuery = resultQuery.replace(placeholder, params[variable]);
      }
    }

    return resultQuery;
  };

  const replaceParametersInCypherQuery = (
    query: string,
    params: InputValues
  ) => {
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
    if (handleError()) {
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
      const finalQuery = replaceParametersInCypherQuery(
        cypherQuery,
        inputValues
      );

      if (finalQuery !== "") {
        ///what they do
        if (setQueryToRun) {
          setQueryToRun(finalQuery);
        }
        console.log("Final Cypher Query:", finalQuery); // print the final query with replaced parameters
        setQueryRunTrue();
      }
    }
  };

  const handleSaveFavorite = async (onClose: () => void) => {
    if (selectedFolder === null) {
      toast.error("No folder selected");
      return;
    } else {
      if (validateParameters(saveCyphertext, saveNatLang)) {
        const newQuery = await handleSaveQuery(
          saveQueryName,
          saveCyphertext,
          saveNatLang,
          selectedFolder,
          projectId
        );

        if (newQuery !== null) {
          setQueryFromQuery(newQuery);
          setSelectedQuery(newQuery);
          onClose();
          toast.success("Query saved successfully");
        }
      } else {
        toast.error(
          "Not all parameters from cyphertext match in natural language box"
        );
        console.log(saveCyphertext, saveNatLang);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        {/* <div className="text-md text-black">{"Query: " + queryName}</div> */}
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
                  onClick={() => handleSaveFavorites(onOpen)}
                >
                  <FontAwesomeIcon icon={faStar} className="w-6" />
                  <p>Add to Favorites</p>
                </UIButton>
              )}
              header={<span className="text-primary">Save favorite query</span>}
              body={
                <SavePopUp
                  saveChooseFolder={saveChooseFolder}
                  queryName={saveQueryName}
                  cyphertext={saveCyphertext}
                  natLang={saveNatLang}
                  updateQueryName={setSaveQueryName}
                  updateCyphertext={setSaveCyphertext}
                  updateNaturalLanguage={setSaveNatLang}
                  folderType={"Favorite"}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  fav={true}
                ></SavePopUp>
              }
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
                    onClick={() => handleSaveFavorite(onClose)}
                  >
                    Save
                  </UIButton>
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

export default QueryTextboxBasic;
