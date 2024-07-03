import React from "react";
import { LuTrash2 } from "react-icons/lu";

import { FolderType, QueryType } from "@/src/libs/types";
import { handleDeleteQuery } from "@/src/utils/apiCalls/query/handleDeleteQuery";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

/**
 * DeleteQuery Component
 *
 * @description
 * This component renders a modal dialog for confirming the deletion of a query. It uses the UIModal component to
 * provide the modal interface and includes buttons to either cancel or confirm the deletion. The deletion process
 * involves an asynchronous API call to delete the query and then updating the parent component's state based on
 * the result.
 *
 * @props
 * @param {QueryType} query - The query object that is to be deleted.
 * @param {(deletingQuery: boolean, deleteQuery: QueryType) => void} deleteQuery - A callback function to handle
 *        the state update after the query is deleted. It takes a boolean indicating the success of the deletion
 *        and the query object that was deleted.
 * @param {FolderType} type - The type of the folder containing the query.
 */
const DeleteQuery = ({
  query,
  deleteQuery,
  type,
}: {
  query: QueryType;
  deleteQuery: (deletingQuery: boolean, deleteQuery: QueryType) => void;
  type: FolderType;
}) => {
  /**
   * Loads items after a delay.
   *
   * @param {Promise<boolean>} deleted - A promise resolving to a boolean indicating the success of deletion.
   * @returns {Promise<boolean>} - The result of the deletion after a delay.
   */
  const loadItems = async (deleted: Promise<boolean>) => {
    await new Promise((r) => setTimeout(r, 200));
    return deleted;
  };

  /**
   * Handles the confirmation of query deletion.
   */
  const handleConfirmDeleteQuery = () => {
    const returnedQuery: Promise<boolean> = handleDeleteQuery(query, type);

    loadItems(returnedQuery).then((newItem) => {
      deleteQuery(newItem, query);
    });
    deleteQuery(true, query);
  };

  return (
    <UIModal
      body={
        <p className="text-primary text-lg">
          Are you sure you want to delete this query?
        </p>
      }
      button={({ onOpen }) => (
        <button onClick={onOpen}>
          <LuTrash2 className="text-black"></LuTrash2>
        </button>
      )}
      footer={({ onClose }) => (
        <>
          <UIButton className="bg-danger" onClick={onClose}>
            Cancel
          </UIButton>
          <UIButton
            className="bg-success-700"
            onClick={handleConfirmDeleteQuery}
          >
            Yes
          </UIButton>
        </>
      )}
    ></UIModal>
  );
};

export default DeleteQuery;
