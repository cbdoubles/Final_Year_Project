import React, { useState } from "react";
import QueryIcon from "@/utils/sideBar/QueryIcon";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";
import UIModal from "@/src/components/ui/UIModal";
import UIButton from "@/src/components/ui/UIButton";
import { QueryType } from "@/src/libs/types";
import DefaultPopUp from "@/src/components/sideBar/DefaultPopUp";
import { fetchDefaultQueries } from "./fetches/fetchDefaultFiles";
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
  const { setQueryFromQuery } = useQueryProps();

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

  const handleSelectFolder = async (onClose: () => void) => {
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
          <div
            data-testid="ui-button"
            className="flex items-center cursor-pointer"
            onClick={() => openSelectFolder(onOpen)}
          >
            <GlobeAsiaAustraliaIcon className="w-6" />
            {!collapsed && (
              <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
                {"Default"}
              </p>
            )}
          </div>
        )}
        header={<p className="text-primary">select folder</p>}
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
              onClick={() => handleSelectFolder(onClose)}
            >
              Select
            </UIButton>
          </>
        )}
      ></UIModal>
    </div>
  );
}
