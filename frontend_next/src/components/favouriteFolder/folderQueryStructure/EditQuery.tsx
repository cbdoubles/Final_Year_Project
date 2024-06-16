import React, { useState } from "react";
import UIModal from "@/components/ui/UIModal";
import UIButton from "@/components/ui/UIButton";
import EditQueryBody from "./EditQueryBody";
import { LuPenSquare } from "react-icons/lu";
import { FolderType, QueryType } from "@/src/libs/types";
import { handleEditQuery } from "@/src/utils/sideBar/fetches/handleEditQuery";

const EditQuery = ({
  query,
  editQuery,
  type,
}: {
  query: QueryType;
  editQuery: (editingQuery: boolean, editQuery: QueryType) => void;
  type: FolderType;
}) => {
  const [prevState] = useState(query);
  const [editedQuery, setQuery] = useState(query);

  const updateQueryName = (newQueryName: string) => {
    const updatedQuery = { ...editedQuery, queryName: newQueryName };
    setQuery(updatedQuery);
  };

  const updateCyphertext = (newCyphertext: string) => {
    const updatedQuery = { ...editedQuery, cypherQuery: newCyphertext };
    setQuery(updatedQuery);
  };

  const updateNaturalLanguage = (newNaturalLanguage: string) => {
    const updatedQuery = {
      ...editedQuery,
      natLang: newNaturalLanguage,
    };
    setQuery(updatedQuery);
  };

  const loadItems = async (deleted: Promise<boolean>) => {
    await new Promise((r) => setTimeout(r, 200));
    return deleted;
  };

  const handleSaveEditQuery = () => {
    const returnedQuery: Promise<boolean> = handleEditQuery(query, type);

    loadItems(returnedQuery).then((edited) => {
      if (edited) {
        editQuery(edited, editedQuery);
      } else {
        setQuery(prevState);
      }
    });
    // editQuery(false, editedQuery);
    console.log("in handling edit query");
  };

  return (
    <UIModal
      button={({ onOpen }) => (
        <button onClick={onOpen}>
          <LuPenSquare className="text-black" />
        </button>
      )}
      header={
        <>
          <span className="text-primary">Edit chosen query</span>
          <span className="text-sm text-gray-400 font-light leading-none">
            {type}
          </span>
        </>
      }
      body={
        <EditQueryBody
          query={editedQuery}
          type={type}
          updateQueryName={updateQueryName}
          updateCyphertext={updateCyphertext}
          updateNaturalLanguage={updateNaturalLanguage}
        />
      }
      footer={({ onClose }) => (
        <UIButton
          onClick={() => {
            handleSaveEditQuery();
            onClose();
          }}
        >
          Save
        </UIButton>
      )}
    ></UIModal>
  );
};

export default EditQuery;
