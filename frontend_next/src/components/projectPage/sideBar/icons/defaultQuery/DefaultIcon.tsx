import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-toastify";

import DefaultPopUp from "@/src/components/projectPage/sideBar/icons/defaultQuery/DefaultPopUp";
import { useQueryProps } from "@/src/contexts/QueryContext";
import { QueryType } from "@/src/libs/types";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";
import { fetchDefaultQueries } from "@/utils/apiCalls/query/fetchDefaultQueries";

/**
 * DefaultIcon Component
 *
 * @description
 * This component renders a button that opens a modal for selecting a default query. It fetches the default queries from the server
 * and allows the user to select a query to be set as the current query.
 *
 * @props
 * @param {boolean} collapsed - Boolean prop to control if the sidebar is collapsed.
 * @returns {JSX.Element} The rendered default icon component.
 */
export default function DefaultIcon({ collapsed }: { collapsed: boolean }) {
  const [defaultQueries, setDefaultQueries] = useState<QueryType[] | null>(
    null
  );
  const [selectedDefaultQuery, setSelectedDefaultQuery] =
    useState<QueryType | null>(null);
  const { setQueryFromQuery } = useQueryProps();

  /**
   * Open select folder modal
   *
   * @description
   * Fetches the default queries from the server and opens the modal for selecting a query.
   *
   * @param {() => void} onOpen - Callback function to open the modal.
   */
  const openSelectFolder = async (onOpen: () => void) => {
    const result = await fetchDefaultQueries();
    if (result) {
      setDefaultQueries(result);
      onOpen();
    } else {
      toast.error("No query selected");
    }
  };

  /**
   * Handle select query action
   *
   * @description
   * Sets the selected query as the current query and closes the modal.
   *
   * @param {() => void} onClose - Callback function to close the modal.
   */
  const handleSelectQuery = async (onClose: () => void) => {
    if (selectedDefaultQuery) {
      setQueryFromQuery(selectedDefaultQuery);
      onClose();
    } else {
      toast.error("No folder selected");
    }
  };

  /**
   * Render the component
   *
   * @description
   * Renders a button that opens a modal for selecting a default query. The modal includes a list of default queries
   * and a select button to confirm the selection.
   *
   * @returns {JSX.Element} The rendered default icon component.
   */
  return (
    <div data-testid="default-pop-up">
      <UIModal
        body={
          <DefaultPopUp
            defaultQueries={defaultQueries}
            selectedDefaultQuery={selectedDefaultQuery}
            setSelectedDefaultQuery={setSelectedDefaultQuery}
          />
        }
        button={({ onOpen }) => (
          <button
            className="w-full flex relative h-[48px] grow items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
            data-testid="ui-button"
            data-testid="default-button"
            onClick={() => openSelectFolder(onOpen)}
          >
            <GlobeAsiaAustraliaIcon className="w-6" />
            {!collapsed && (
              <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
                {"Default"}
              </p>
            )}
          </button>
        )}
        footer={({ onClose }) => (
          <>
            <UIButton
              color="primary"
              onClick={() => handleSelectQuery(onClose)}
              data-testid="default-pop-up-select-button"
            >
              Select
            </UIButton>
          </>
        )}
        header={<p className="text-primary">Select Default Query</p>}
      ></UIModal>
    </div>
  );
}
