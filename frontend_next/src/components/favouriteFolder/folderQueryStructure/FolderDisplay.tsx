import { useState } from "react";
import { LuFolder } from "react-icons/lu";
import QueryDisplay from "./QueryDisplay";
import EditFolder from "./EditFolder";
import DeleteFolder from "./DeleteFolder";
import {
  QueryType,
  QueryFolderType,
  QueryFolderListType,
} from "@/src/libs/types";

const FolderDisplay = ({
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
  const [open, setOpen] = useState(true);
  const [folder, setFolder] = useState<QueryFolderType>(item.folder);
  const [queries, setQueries] = useState(item.queries);

  const handleFolderClick = () => {
    setOpen(!open);
  };

  const updateFolderName = (newFolderName: string) => {
    const updatedFolder = { ...folder, folderName: newFolderName };
    setFolder(updatedFolder);
    item.folder = updatedFolder; // Avoid mutating props directly
  };

  const deleteQuery = (deletingQuery: boolean, deleteQuery: QueryType) => {
    if (deletingQuery) {
      const updatedQueries = item.queries.filter(
        (query) => query.queryId !== deleteQuery.queryId
      );
      setQueries(updatedQueries);
    }
  };

  return (
    <div className={"bg-sky-600"}>
      <div className="flex items-center justify-between">
        <button
          onClick={handleFolderClick}
          className="cursor-pointer text-white flex items-center gap-1"
        >
          <LuFolder className="ml-2 text-white" />
          {folder.folderName}
        </button>
        <div className="flex gap-2">
          <EditFolder folder={folder} updateFolderName={updateFolderName} />
          <DeleteFolder folder={folder} deleteFolder={deleteFolder} />
        </div>
      </div>
      {queries.length > 0 && open && (
        <div className="w-full">
          <QueryDisplay
            queries={queries}
            canBeShared={canBeShared}
            handlerClick={handlerClick} // Ensure handlerClick matches the type here
            deleteQuery={deleteQuery}
            type={item.folder.folderType}
          />
        </div>
      )}
    </div>
  );
};

export default FolderDisplay;
