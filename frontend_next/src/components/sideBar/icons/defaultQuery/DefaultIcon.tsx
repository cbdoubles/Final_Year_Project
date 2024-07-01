import React, { useState } from "react";
import QueryIcon from "@/utils/sideBar/QueryIcon";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";
import UIModal from "@/src/utils/ui/UIModal";
import UIButton from "@/src/utils/ui/UIButton";
import { QueryType } from "@/src/libs/types";
import DefaultPopUp from "@/src/components/sideBar/icons/defaultQuery/DefaultPopUp";
import { fetchDefaultQueries } from "@/utils/sideBar/fetches/fetchDefaultQueries";
import { toast } from "react-toastify";
import { useQueryProps } from "@/src/contexts/QueryContext";

export default function DefaultIcon({ collapsed }: { collapsed: boolean }) {
  // const loadItems = async () => {
  //   await new Promise((r) => setTimeout(r, 2000))
  //   return items
  // }

  const [defaultQueries, setDefaultQueries] = useState<QueryType[] | null>(
    null
  );
  const [selectedDefaultQuery, setSelectedDefaultQuery] =
    useState<QueryType | null>(null);
  const { updatedQuery, setQueryFromQuery } = useQueryProps();

  const openSelectFolder = async (onOpen: () => void) => {
    const result = await fetchDefaultQueries();
    console.log("Fetched folders:", result);
    if (result) {
      setDefaultQueries(result);
      onOpen();
    } else {
      toast.error("No query selected");
    }
  };

  const handleSelectQuery = async (onClose: () => void) => {
    if (selectedDefaultQuery) {
      setQueryFromQuery(selectedDefaultQuery);
      onClose();
    } else {
      toast.error("No folder selected");
    }
  };

  return (
    <div>
      <UIModal
        button={({ onOpen }) => (
          <button
            data-testid="ui-button"
            className="w-full flex relative h-[48px] grow items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
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
        header={<p className="text-primary">Select Default Query</p>}
        body={
          <DefaultPopUp
            defaultQueries={defaultQueries}
            selectedDefaultQuery={selectedDefaultQuery}
            setSelectedDefaultQuery={setSelectedDefaultQuery}
          />
        }
        footer={({ onClose }) => (
          <>
            <UIButton
              color="primary"
              onClick={() => handleSelectQuery(onClose)}
            >
              Select
            </UIButton>
          </>
        )}
      ></UIModal>
    </div>
  );
}
