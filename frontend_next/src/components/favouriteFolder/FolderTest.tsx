import React, { MouseEvent } from "react";
import SelectGroup from "@/src/components/favouriteFolder/SelectGroup";
import { QueryFolderListType } from "@/src/libs/types";

interface SelectProps {
  title: string;
  items: QueryFolderListType[];
  type: "Default" | "Custom" | "Favorite";
  canBeShared: boolean;
}

const FolderTest: React.FC<SelectProps> = ({ items, type, canBeShared }) => {
  // Event handler
  const handleClick = (event: MouseEvent) =>
    console.log("clicked newitem type");

  // Button click handler
  const handleButtonClick = () => {
    console.log("Select Query button clicked");
  };

  // Trash bin click handler
  const handleTrashClick = (favorite: string) => {
    console.log(`Trash bin clicked for ${favorite}`);
  };

  return (
    <div>
      {items.length === 0 ? (
        <p>No query found</p>
      ) : (
        <div>
          {items.map((item) => (
            <SelectGroup
              key={`select_group_${item.folder.folderId}`}
              item={item}
              type={type}
              canBeShared={canBeShared}
              handlerClick={handleClick}
              handlerTrashClick={handleTrashClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTest;
