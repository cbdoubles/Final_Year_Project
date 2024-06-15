import React, { MouseEvent, useState } from "react";
import SelectGroup from "@/src/components/favouriteFolder/SelectGroup";
import { QueryFolderListType, QueryFolderType } from "@/src/libs/types";

interface SelectProps {
  title: string;
  items: QueryFolderListType[];
  type: "Default" | "Custom" | "Favorite";
  canBeShared: boolean;
}

const FolderTest: React.FC<SelectProps> = ({ items, canBeShared }) => {
  const [folderItems, setFolderItems] = useState(items);
  // Event handler
  const handleClickQuery = (event: MouseEvent) =>
    console.log("clicked newitem type");

  // Button click handler
  const handleButtonClick = () => {
    console.log("Select Query button clicked");
  };

  const deleteFolder = (deleteFolder: boolean, folder: QueryFolderType) => {
    console.log("deleting in foldertest");
    console.log(deleteFolder);
    console.log(folder.folderId);
    if (deleteFolder) {
      const updatedItems = items.filter(
        (item) => item.folder.folderId !== folder.folderId
      );
      setFolderItems(updatedItems);
      console.log("Updated items:", updatedItems);
      console.log("Updated items:", folderItems);
    }
  };

  return (
    <div>
      {items.length === 0 ? (
        <p>No query found</p>
      ) : (
        <div>
          {folderItems.map((item) => (
            <SelectGroup
              key={`select_group_${item.folder.folderId}`}
              item={item}
              canBeShared={canBeShared}
              handlerClick={handleClickQuery}
              deleteFolder={deleteFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTest;
