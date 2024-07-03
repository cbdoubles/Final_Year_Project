import React, { useState } from "react";
import FolderTest from "@/src/utils/displayFolderQueries/DisplayFoldersQueries";
import QueryIconButton from "./QueryIconButton";
import UIModal from "@/src/utils/ui/UIModal";
import UIButton, { UIButtonProps } from "@/src/utils/ui/UIButton";
import { FolderType, QueryType, QueryFolderListType } from "@/src/libs/types";
import { fetchFoldersQueries } from "@/src/utils/apiCalls/foldersQueries/fetchFoldersQueries";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { toast } from "react-toastify";

// Interface that defines the props expected by the QueryIcon component
interface SelectProps {
  onCloseSelectFolder?: () => void;
  onCloseChooseProject?: () => void;
  collapsed?: boolean;
  type: FolderType;
  icon:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | React.FunctionComponent<UIButtonProps>;
  projectId: number;
}

//Define the component - its variables and methods
const QueryIcon: React.FC<SelectProps> = ({
  onCloseSelectFolder,
  onCloseChooseProject,
  collapsed,
  type,
  icon: Icon,
  projectId,
}) => {
  // State for managing the list of items (queries or folders)
  const [items, setItems] = useState<QueryFolderListType[]>([]);
  // State to indicate if data is being loaded
  const [isLoading, setIsLoading] = useState(false);
  // State to hold the currently selected query
  const [selectedQuery, setSelectedQuery] = useState<QueryType | null>(null);
  // Context hook to set the selected query globally
  const { setQueryFromQuery } = useQueryProps();

  // Function to simulate loading delay and return the fetched items
  const loadItems = async (queryFolderList: Promise<QueryFolderListType[]>) => {
    await new Promise((r) => setTimeout(r, 200));
    return queryFolderList;
  };

  // Function to fetch items from the database and update the state
  const fetchItems = () => {
    setIsLoading(true);
    const queryFolderList: Promise<QueryFolderListType[]> = fetchFoldersQueries(
      type,
      projectId
    );

    loadItems(queryFolderList).then((newItems) => {
      setItems(newItems);
      setIsLoading(false);
    });
  };

  // Event handler for selecting a query from the list
  const handleSelectQuery = (query: QueryType) => {
    setSelectedQuery(query);
  };

  // Handler for the button click event to select a query
  const handleSelectQueryButtonClick = (onClose: () => void) => {
    console.log("Select Query button clicked");
    if (selectedQuery) {
      onClose();
      setQueryFromQuery(selectedQuery);
      if (onCloseSelectFolder) {
        onCloseSelectFolder();
      }
      if (onCloseChooseProject) {
        onCloseChooseProject();
      }
    } else {
      toast.error("No query selected");
    }
  };

  // Rendering the component
  return (
    <>
      <UIModal
        button={({ onOpen }) => (
          <QueryIconButton
            handleClick={() => {
              fetchItems();
              onOpen();
            }}
            collapsed={collapsed}
            type={type}
            icon={Icon}
          />
        )}
        header={
          <>
            <span className="text-primary">Select a query</span>
            <span className="text-sm text-gray-400 font-light leading-none">
              {type}
            </span>
          </>
        }
        body={
          isLoading ? (
            <p className="text-black">Loading</p>
          ) : (
            <FolderTest
              title={`Select a ${type} query`}
              items={items}
              canBeShared={false}
              handleSelectQuery={handleSelectQuery}
              type="Default"
            />
          )
        }
        footer={({ onClose }) => (
          <UIButton onClick={() => handleSelectQueryButtonClick(onClose)}>
            Select query
          </UIButton>
        )}
        bodyNoPadding
      ></UIModal>
    </>
  );
};

export default QueryIcon;
