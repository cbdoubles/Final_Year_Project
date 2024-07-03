import React from "react";
import { QueryType } from "@/src/libs/types";

type DefaultPopUpProps = {
  defaultQueries: QueryType[] | null;
  selectedDefaultQuery: QueryType | null;
  setSelectedDefaultQuery: (folder: QueryType | null) => void;
};

const DefaultPopUp: React.FC<DefaultPopUpProps> = ({
  defaultQueries,
  selectedDefaultQuery,
  setSelectedDefaultQuery,
}) => {
  console.log("Folders passed to SelectFolder:", defaultQueries);

  const handleQueryClick = (query: QueryType | null) => {
    setSelectedDefaultQuery(query);
  };

  return (
    <div>
      {defaultQueries &&
        defaultQueries.map((query) => (
          <div
            key={query.queryId}
            className={`flex justify-between items-center text-black p-2 cursor-pointer ${
              selectedDefaultQuery === query ? "bg-gray-200" : ""
            }`}
            onClick={() => handleQueryClick(query)}
          >
            <span>{query.queryName}</span>
          </div>
        ))}
    </div>
  );
};

export default DefaultPopUp;
