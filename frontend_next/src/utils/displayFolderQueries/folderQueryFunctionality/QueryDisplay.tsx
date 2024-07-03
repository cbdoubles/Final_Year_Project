import { LuCornerDownRight, LuShare } from "react-icons/lu";
import { FolderType, QueryType } from "@/src/libs/types";
import EditQuery from "./EditQuery";
import DeleteQuery from "./DeleteQuery";
import { Button } from "@nextui-org/button";
import { React, useState } from "react";

/**
 * @description
 * QueryDisplay Component
 * This component is responsible for displaying a list of queries. It allows for each query to be interacted with - specifically,
 * queries can be clicked on, edited, or deleted. Additionally, if enabled, queries can be shared. The component visually
 * differentiates between even and odd queries for better readability and provides a visual indication of the currently selected query.
 *
 * @props
 * @param {QueryType[]} queries - The list of queries to be displayed.
 * @param {boolean} canBeShared - Indicates if the queries can be shared.
 * @param {(query: QueryType) => void} handlerClick - Function to handle clicks on queries, typically to view or execute them.
 * @param {(deletingQuery: boolean, deleteQuery: QueryType) => void} deleteQuery - Function to delete a specific query.
 * @param {(editingQuery: boolean, editQuery: QueryType) => void} editQuery - Function to edit a specific query.
 * @param {FolderType} type - The type of folder the queries belong to, used for categorization or filtering.
 * @param {number | null} selectedButtonId - The ID of the currently selected button, if any.
 * @param {React.Dispatch<React.SetStateAction<number | null>>} setSelectedButtonId - Function to set the ID of the selected button.
 *
 * @state
 * @param {number | null} pressedButtonId - State to track the ID of the pressed query button. Null if no button is pressed. This is used to visually indicate the currently active or selected query.
 */

const QueryDisplay = ({
  queries,
  canBeShared,
  handlerClick,
  deleteQuery,
  editQuery,
  type,
}: {
  queries: QueryType[];
  canBeShared: boolean;
  handlerClick: (query: QueryType) => void;
  deleteQuery: (deletingQuery: boolean, deleteQuery: QueryType) => void;
  editQuery: (editingQuery: boolean, editQuery: QueryType) => void;
  type: FolderType;
  selectedButtonId: number | null;
  setSelectedButtonId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [pressedButtonId, setPressedButtonId] = useState<number | null>(null);

  return (
    <>
      {queries.map((query, key) => (
        <div
          key={query.queryId}
          className={`w-full flex items-center px-8 justify-between ${
            key % 2 === 0 ? "bg-sky-100" : "bg-white"
          }`}
        >
          <Button
            className={`flex w-full gap-1 justify-start text-lg ${
              pressedButtonId === query.queryId
                ? "bg-blue-500"
                : "bg-transparent"
            }`}
            onClick={() => {
              handlerClick(query);
              setPressedButtonId((prevId) =>
                prevId === query.queryId ? null : query.queryId
              );
            }}
          >
            <LuCornerDownRight className="text-gray-600" />
            <p className="cursor-pointer text-black capitalize">
              {query.queryName}
            </p>
          </Button>
          <div className="flex gap-2 ">
            {canBeShared && (
              <button>
                <LuShare className="text-black" />
              </button>
            )}
            <EditQuery editQuery={editQuery} query={query} type={type} />
            <DeleteQuery deleteQuery={deleteQuery} query={query} type={type} />
          </div>
        </div>
      ))}
    </>
  );
};
export default QueryDisplay;
