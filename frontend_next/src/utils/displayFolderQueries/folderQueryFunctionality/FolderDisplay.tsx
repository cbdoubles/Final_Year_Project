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

/**
 * @description
 * FolderDisplay Component
 * This component is responsible for displaying a folder's information, including its name and the queries it contains.
 * It allows for the folder name to be edited and the folder to be deleted. It also displays the queries within the folder
 * and provides functionality to edit and delete these queries.
 *
 * @props
 * @param {QueryFolderListType} item - The folder and its queries to be displayed.
 * @param {boolean} canBeShared - Indicates if the folder can be shared.
 * @param {(query: QueryType) => void} handlerClick - Function to handle clicks on queries.
 * @param {(deleteFolder: boolean, folder: QueryFolderType) => void} deleteFolder - Function to delete the folder.
 *
 * @state
 * @param {boolean} open - State to control the visibility of the folder's queries. True if the queries are visible.
 * @param {QueryFolderType} folder - State representing the current folder. It starts with the folder passed in props and can be updated.
 * @param {QueryType[]} queries - State representing the list of queries within the folder. It starts with the queries passed in props and can be updated.
 * @param {number | null} selectedButtonId - State to track the ID of the selected query button. Null if no button is selected.
 */

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
  const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);

  const handleFolderClick = () => {
    setOpen(!open);
  };

  const updateFolderName = (newFolderName: string) => {
    const updatedFolder = { ...folder, folderName: newFolderName };
    setFolder(updatedFolder);
    item.folder = updatedFolder;
  };

  const deleteQuery = (deletingQuery: boolean, deleteQuery: QueryType) => {
    if (deletingQuery) {
      const updatedQueries = item.queries.filter(
        (query) => query.queryId !== deleteQuery.queryId
      );
      setQueries(updatedQueries);
    }
  };

  const editQuery = (editingQuery: boolean, editQuery: QueryType) => {
    if (editingQuery) {
      const updatedQueries = item.queries.map((query) =>
        query.queryId === editQuery.queryId ? { ...query, ...editQuery } : query
      );
      setQueries(updatedQueries);
    }
  };

  return (
    <div className={"bg-sky-600"}>
      <div className="flex items-center justify-between">
        <button
          className="cursor-pointer text-white flex items-center gap-1"
          onClick={handleFolderClick}
        >
          <LuFolder className="ml-2 text-white" />
          {folder.folderName}
        </button>
        <div className="flex gap-2">
          <EditFolder folder={folder} updateFolderName={updateFolderName} />
          <DeleteFolder deleteFolder={deleteFolder} folder={folder} />
        </div>
      </div>
      {queries.length > 0 && open && (
        <div className="w-full">
          <QueryDisplay
            canBeShared={canBeShared}
            deleteQuery={deleteQuery}
            editQuery={editQuery}
            handlerClick={handlerClick}
            queries={queries}
            selectedButtonId={selectedButtonId}
            setSelectedButtonId={setSelectedButtonId}
            type={item.folder.folderType}
          />
        </div>
      )}
    </div>
  );
};

export default FolderDisplay;
