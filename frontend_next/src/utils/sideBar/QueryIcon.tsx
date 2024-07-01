import React, { useState } from "react";
import FolderTest from "@/src/components/favouriteFolder/FolderTest";
import QueryIconButton from "./QueryIconButton";
import UIModal from "@/src/utils/ui/UIModal";
import UIButton, { UIButtonProps } from "@/src/utils/ui/UIButton";
import { FolderType, QueryType, QueryFolderListType } from "@/src/libs/types";
import { fetchFoldersQueries } from "@/src/utils/sideBar/fetches/fetchFoldersQueries";
// import { useProjectProps } from "@/src/contexts/ProjectContext";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { toast } from "react-toastify";

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
  // const { projectId } = useProjectProps();
  const { setQueryFromQuery } = useQueryProps();

  const loadItems = async (queryFolderList: Promise<QueryFolderListType[]>) => {
    await new Promise((r) => setTimeout(r, 200));
    return queryFolderList;
  };

  const fetchItems = () => {
    setIsLoading(true);
    //fetchItems from database, then put in the queryFolderList
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

  // Button click handler
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
