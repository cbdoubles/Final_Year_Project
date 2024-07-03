import React from "react";

import { QueryType } from "@/src/libs/types";

type DefaultPopUpProps = {
  defaultQueries: QueryType[] | null;
  selectedDefaultQuery: QueryType | null;
  setSelectedDefaultQuery: (folder: QueryType | null) => void;
};

/**
 * DefaultPopUp Component
 *
 * @description
 * This component renders a list of default queries and allows the user to select a query.
 * The selected query is highlighted, and the selection is managed through the setSelectedDefaultQuery function.
 *
 * @props
 * @param {QueryType[] | null} defaultQueries - The list of default queries to display.
 * @param {QueryType | null} selectedDefaultQuery - The currently selected default query.
 * @param {(folder: QueryType | null) => void} setSelectedDefaultQuery - Function to set the selected default query.
 */
const DefaultPopUp: React.FC<DefaultPopUpProps> = ({
  defaultQueries,
  selectedDefaultQuery,
  setSelectedDefaultQuery,
}) => {
  console.log("Folders passed to SelectFolder:", defaultQueries);

  /**
   * Handle query click
   *
   * @description
   * Sets the selected default query when a query is clicked.
   *
   * @param {QueryType | null} query - The query that was clicked.
   */
  const handleQueryClick = (query: QueryType | null) => {
    setSelectedDefaultQuery(query);
  };

  /**
   * Render the component
   *
   * @description
   * Renders a list of default queries. Each query is displayed as a clickable item, and the selected query is highlighted.
   *
   * @returns {JSX.Element} The rendered list of default queries.
   */
  return (
    <div>
      {defaultQueries &&
        defaultQueries.map((query) => (
          <div
            key={query.queryId}
            className={`flex justify-between items-center text-black p-2 cursor-pointer ${
              selectedDefaultQuery === query ? "bg-gray-200" : ""
            }`}
            data-testid="select-existing-project-modal"
            onClick={() => handleQueryClick(query)}
          >
            <span>{query.queryName}</span>
          </div>
        ))}
    </div>
  );
};

export default DefaultPopUp;
