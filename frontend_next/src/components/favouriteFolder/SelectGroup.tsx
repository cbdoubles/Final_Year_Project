//////////////
//////////////
//////////////
//Don't use anymore

import {
  QueryType,
  QueryFolderListType,
  QueryFolderType,
} from "@/src/libs/types";
import FolderDisplay from "./folderQueryStructure/FolderDisplay";

const SelectGroup = ({
  item,
  canBeShared,
  handlerClick,
  deleteFolder,
}: {
  item: QueryFolderListType;
  canBeShared: boolean;
  handlerClick: (query: QueryType) => void;
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
