import React, { useState } from "react";
import FolderTest from "@/src/components/favouriteFolder/FolderTest";
import QueryIconButton from "./QueryIconButton";
import UIModal from "@/src/components/ui/UIModal";
import UIButton from "@/src/components/ui/UIButton";
import {
  QueryFolderType,
  QueryType,
  QueryFolderListType,
  FolderType,
} from "@/src/libs/types";
import { fetchFoldersQueries } from "@/src/utils/sideBar/fetches/fetchFoldersQueries";
import { useProjectProps } from "@/src/contexts/ProjectContext";

interface SelectProps {
  collapsed?: boolean;
  type: "Default" | "Custom" | "Favorite";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const folders: QueryFolderType[] = [
  { folderId: 1, folderName: "Folder 1" },
  { folderId: 2, folderName: "Folder 2" },
];

const queries: QueryType[] = [
  {
    queryId: 1,
    folderId: 1,
    queryName: "Query 1",
    cypherQuery: "MATCH (n) RETURN n",
    natLang: "Find all nodes",
  },
  {
    queryId: 2,
    folderId: 1,
    queryName: "Query 2",
    cypherQuery: "MATCH (n)-[r]->(m) RETURN r",
    natLang: "Find all relationships",
  },
  {
    queryId: 3,
    folderId: 2,
    queryName: "Query 3",
    cypherQuery: "MATCH (n:Person) RETURN n",
    natLang: "Find all persons",
  },
];

const QueryIcon: React.FC<SelectProps> = ({ collapsed, type, icon: Icon }) => {
  const [items, setItems] = useState<QueryFolderListType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadItems = async (queryFolderList: Promise<QueryFolderListType[]>) => {
    await new Promise((r) => setTimeout(r, 2000));
    return queryFolderList;
  };

  const { projectId } = useProjectProps();

  const fetchItems = () => {
    setIsLoading(true);
    //fetchItems from database, then put in the queryFolderList
    const queryFolderList: Promise<QueryFolderListType[]> = fetchFoldersQueries(
      type,
      projectId
    );

    // const queryFolderList: QueryFolderListType[] = combineFoldersAndQueries(
    //   folders,
    //   queries
    // );
    loadItems(queryFolderList).then((newItems) => {
      setItems(newItems);
      setIsLoading(false);
    });
  };

  // Button click handler
  const handleButtonClick = () => {
    console.log("Select Query button clicked");
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
              type="Default"
            />
          )
        }
        footer={({ onClose }) => (
          <UIButton onClick={handleButtonClick}>Select query</UIButton>
        )}
        bodyNoPadding
      ></UIModal>
    </>
  );
};

export default QueryIcon;
