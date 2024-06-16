import React, { useState } from "react";
import FolderDisplay from "./folderQueryStructure/FolderDisplay";
import {
  QueryType,
  QueryFolderListType,
  QueryFolderType,
  FolderType,
} from "@/src/libs/types";

interface SelectProps {
  title: string;
  items: QueryFolderListType[];
  type: FolderType;
  canBeShared: boolean;
  handleSelectQuery: (query: QueryType) => void;
}

const FolderTest: React.FC<SelectProps> = ({
  items,
  canBeShared,
  handleSelectQuery,
}) => {
  const [folderItems, setFolderItems] = useState(items);

  const deleteFolder = (deleteFolder: boolean, folder: QueryFolderType) => {
    if (deleteFolder) {
      const updatedItems = items.filter(
        (item) => item.folder.folderId !== folder.folderId
      );
      setFolderItems(updatedItems);
    }
  };

  return (
    <div>
      {items.length === 0 ? (
        <p>No query found</p>
      ) : (
        <div>
          {folderItems.map((item) => (
            <FolderDisplay
              key={`select_group_${item.folder.folderId}`}
              item={item}
              canBeShared={canBeShared}
              handlerClick={handleSelectQuery}
              deleteFolder={deleteFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTest;
