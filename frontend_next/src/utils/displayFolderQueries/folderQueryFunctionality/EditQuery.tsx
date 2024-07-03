import React, { useState } from "react";
import { LuPenSquare } from "react-icons/lu";

import EditQueryBody from "./EditQueryBody";

import { FolderType, QueryType } from "@/src/libs/types";
import { handleEditQuery } from "@/src/utils/apiCalls/query/handleEditQuery";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

/**
 * @description
 * EditQuery Component
 * This component is responsible for editing the details of a specific query. It utilizes a modal to present the user with input fields for editing the query's name, cyphertext representation, and natural language representation. Changes can be saved or discarded.
 *
 * @props
 * @param {QueryType} query - The initial query object to be edited.
 * @param {(editingQuery: boolean, editQuery: QueryType) => void} editQuery - Function to handle the edited query. The first parameter indicates if the editing was successful, and the second parameter is the edited query object.
 * @param {FolderType} type - The type of folder the query belongs to. This is used for categorization or filtering purposes.
 *
 * @state
 * @param {QueryType} prevState - State to hold the initial state of the query before any edits. This is used to revert changes if needed.
 * @param {QueryType} editedQuery - State to hold the currently edited query. This state is updated as the user makes changes in the modal.
 *
 * @function
 * @param {string} newQueryName - The new name for the query.
 * @description
 * updateQueryName updates the editedQuery state with the new name provided by the user.
 *
 * @function
 * @param {string} newCyphertext - The new cyphertext representation for the query.
 * @description
 * updateCyphertext updates the editedQuery state with the new cyphertext provided by the user.
 *
 * @function
 * @param {string} newNaturalLanguage - The new natural language representation for the query.
 * @description
 * updateNaturalLanguage updates the editedQuery state with the new natural language representation provided by the user.
 *
 * @function
 * @param {Promise<boolean>} deleted - A promise that resolves to a boolean indicating whether the edit operation was successful.
 * @description
 * loadItems simulates loading and waits for the 'deleted' promise to resolve. It is used to handle asynchronous operations related to editing the query.
 *
 * @function
 * @description
 * handleSaveEditQuery handles the saving of the edited query. It calls the handleEditQuery API function with the edited query and type, waits for the operation to complete, and then either updates the query state with the edited query or reverts to the previous state if the edit was not successful.
 */

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
    const returnedQuery: Promise<boolean> = handleEditQuery(editedQuery, type);

    loadItems(returnedQuery).then((edited) => {
      if (edited) {
        editQuery(edited, editedQuery);
      } else {
        setQuery(prevState);
      }
    });
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
          updateCyphertext={updateCyphertext}
          updateNaturalLanguage={updateNaturalLanguage}
          updateQueryName={updateQueryName}
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
