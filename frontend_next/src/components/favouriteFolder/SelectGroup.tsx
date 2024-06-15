import { MouseEvent } from "react";
import { QueryFolderListType, QueryFolderType } from "@/src/libs/types";
import FolderDisplay from "./folderQueryStructure/FolderDisplay";

const SelectGroup = ({
  item,
  canBeShared,
  handlerClick,
  deleteFolder,
}: {
  item: QueryFolderListType;
  canBeShared: boolean;
  handlerClick: (event: MouseEvent) => void;
  deleteFolder: (deleteFolder: boolean, folder: QueryFolderType) => void;
}) => {
  return (
    <FolderDisplay
      item={item}
      canBeShared={canBeShared}
      handlerClick={handlerClick}
      deleteFolder={deleteFolder}
    />
  );
};

export default SelectGroup;
