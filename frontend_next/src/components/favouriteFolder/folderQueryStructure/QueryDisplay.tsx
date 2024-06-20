import { LuCornerDownRight, LuShare } from "react-icons/lu";
import { FolderType, QueryType } from "@/src/libs/types";
import EditQuery from "./EditQuery";
import DeleteQuery from "./DeleteQuery";
import { Button } from "@nextui-org/button";
import { useState } from "react";

const QueryDisplay = ({
  queries,
  canBeShared,
  handlerClick,
  deleteQuery,
  editQuery,
  type,
  selectedButtonId,
  setSelectedButtonId,
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
          className={`w-full flex items-center px-8 justify-between ${
            key % 2 === 0 ? "bg-sky-100" : "bg-white"
          }`}
          key={query.queryId}
        >
          <Button
            className={`flex w-full gap-1 justify-start text-lg ${
              selectedButtonId === query.queryId
                ? "bg-blue-500"
                : "bg-transparent"
            }`}
            onClick={() => {
              handlerClick(query);
              setSelectedButtonId((prevId) =>
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
            <EditQuery query={query} editQuery={editQuery} type={type} />
            <DeleteQuery query={query} deleteQuery={deleteQuery} type={type} />
          </div>
        </div>
      ))}
    </>
  );
};
export default QueryDisplay;
