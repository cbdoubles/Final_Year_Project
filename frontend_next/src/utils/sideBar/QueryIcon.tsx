import React, { useState } from "react";
import { toast } from "react-toastify";

import QueryIconButton from "./QueryIconButton";

import { useQueryProps } from "@/src/contexts/QueryContext";
import { FolderType, QueryType, QueryFolderListType } from "@/src/libs/types";
import { fetchFoldersQueries } from "@/src/utils/apiCalls/foldersQueries/fetchFoldersQueries";
import FolderTest from "@/src/utils/displayFolderQueries/DisplayFoldersQueries";
import UIButton, { UIButtonProps } from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

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
    <div data-testid="queries-modal">
      <UIModal
        body={
          isLoading ? (
            <p className="text-black">Loading</p>
          ) : (
            <FolderTest
              canBeShared={false}
              handleSelectQuery={handleSelectQuery}
              items={items}
              title={`Select a ${type} query`}
              type="Default"
            />
          )
        }
        button={({ onOpen }) => (
          <QueryIconButton
            handleClick={() => {
              fetchItems();
              onOpen();
            }}
            collapsed={collapsed}
            icon={Icon}
            type={type}
          />
        )}
        footer={({ onClose }) => (
          <UIButton onClick={() => handleSelectQueryButtonClick(onClose)}>
            Select query
          </UIButton>
        )}
        header={
          <>
            <span className="text-primary">Select a query</span>
            <span className="text-sm text-gray-400 font-light leading-none">
              {type}
            </span>
          </>
        }
        bodyNoPadding
      ></UIModal>
    </div>
  );
};

export default QueryIcon;
