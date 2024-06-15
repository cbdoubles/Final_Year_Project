import { MouseEvent } from "react";
import { LuCornerDownRight, LuShare } from "react-icons/lu";
import { QueryType } from "@/src/libs/types";
import EditQuery from "./EditQuery";
import DeleteQuery from "./DeleteQuery";

const QueryDisplay = ({
  queries,
  canBeShared,
  handlerClick,
}: {
  queries: QueryType[];
  canBeShared: boolean;
  handlerClick: (event: MouseEvent) => void;
}) => {
  return (
    <>
      {queries.map((query, key) => (
        <div
          className={`w-full flex items-center px-8 justify-between ${
            key % 2 === 0 ? "bg-sky-100" : "bg-white"
          }`}
          key={query.queryId}
          onClick={handlerClick}
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
            <EditQuery />
            <DeleteQuery queryId={query.queryId} />
          </div>
        </div>
      ))}
    </>
  );
};

export default QueryDisplay;
