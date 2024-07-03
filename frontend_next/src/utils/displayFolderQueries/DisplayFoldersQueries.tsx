import React, { useState } from "react";
import FolderDisplay from "./folderQueryFunctionality/FolderDisplay";
import {
  QueryType,
  QueryFolderListType,
  QueryFolderType,
  FolderType,
} from "@/src/libs/types";

/**
 * @description
 * FolderTest Component
 * This component is responsible for rendering a list of folders and their associated queries. It allows for interaction with these folders,
 * including the ability to delete a folder. It also provides functionality to select and interact with individual queries within these folders.
 *
 * @props
 * @param {string} title - The title of the component or section where the folders are displayed.
 * @param {QueryFolderListType[]} items - The list of folders along with their queries to be displayed.
 * @param {FolderType} type - The type of folder, used for categorization or filtering purposes.
 * @param {boolean} canBeShared - Indicates if the folders and their queries can be shared.
 * @param {(query: QueryType) => void} handleSelectQuery - Function to handle the selection of a query. This could be used to view, edit, or execute the selected query.
 *
 * @state
 * @param {QueryFolderListType[]} folderItems - State representing the list of folders and their queries. It starts with the folders passed in props and can be updated, for example, when a folder is deleted.
 *
 * @function
 * @param {boolean} deleteFolder - Indicates whether a folder should be deleted.
 * @param {QueryFolderType} folder - The folder to be deleted.
 * @description
 * The deleteFolder function updates the folderItems state by filtering out the folder that matches the provided folderId. This effectively removes the folder from the displayed list.
 */

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
              canBeShared={canBeShared}
              deleteFolder={deleteFolder}
              handlerClick={handleSelectQuery}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTest;
