import React, { useState } from "react";
import FolderTest from "@/src/utils/displayFolderQueries/DisplayFoldersQueries";
import QueryIconButton from "./QueryIconButton";
import UIModal from "@/src/utils/ui/UIModal";
import UIButton, { UIButtonProps } from "@/src/utils/ui/UIButton";
import { FolderType, QueryType, QueryFolderListType } from "@/src/libs/types";
import { fetchFoldersQueries } from "@/src/utils/apiCalls/foldersQueries/fetchFoldersQueries";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { toast } from "react-toastify";

/**
 * QueryIcon Component
 *
 * @description
 * This component renders an icon that, when clicked, opens a modal allowing the user to select a query from a list.
 * It is designed to integrate with various parts of the UI where selecting a query is necessary.
 *
 * @props
 * @param {Function} onCloseSelectFolder - Optional callback to be called when the folder selection modal is closed.
 * @param {Function} onCloseChooseProject - Optional callback to be called when the project selection modal is closed.
 * @param {boolean} collapsed - Indicates if the icon should be rendered in a collapsed state.
 * @param {FolderType} type - The type of folder to fetch queries from.
 * @param {React.ComponentType<React.SVGProps<SVGSVGElement>> | React.FunctionComponent<UIButtonProps>} icon - The icon to be displayed.
 * @param {number} projectId - The ID of the project to fetch queries for.
 *
 * @state
 * @param {QueryFolderListType[]} items - The list of queries or folders fetched from the database.
 * @param {boolean} isLoading - Indicates if the component is currently loading data.
 * @param {QueryType | null} selectedQuery - The currently selected query.
 */

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

const QueryIcon: React.FC<SelectProps> = ({
  onCloseSelectFolder,
  onCloseChooseProject,
  collapsed,
  type,
  icon: Icon,
  projectId,
}) => {
  const [items, setItems] = useState<QueryFolderListType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<QueryType | null>(null);
  const { setQueryFromQuery } = useQueryProps();
  const loadItems = async (queryFolderList: Promise<QueryFolderListType[]>) => {
    await new Promise((r) => setTimeout(r, 200));
    return queryFolderList;
  };

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

  const handleSelectQuery = (query: QueryType) => {
    setSelectedQuery(query);
  };

  const handleSelectQueryButtonClick = (onClose: () => void) => {
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
