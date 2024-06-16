import { LuCornerDownRight, LuShare } from "react-icons/lu";
import { FolderType, QueryType } from "@/src/libs/types";
import EditQuery from "./EditQuery";
import DeleteQuery from "./DeleteQuery";

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
}) => {


  return (
    <>
      {queries.map((query, key) => (
        <div
          className={`w-full flex items-center px-8 justify-between ${
            key % 2 === 0 ? "bg-sky-100" : "bg-white"
          }`}
          key={query.queryId}
          onClick={() => handlerClick(query)}
        >
          <button className="flex gap-1 items-center">
            <LuCornerDownRight className="text-gray-600" />
            <p className="cursor-pointer text-black capitalize">
              {query.queryName}
            </p>
          </button>
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
