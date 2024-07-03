import React from "react";
import { LuTrash2 } from "react-icons/lu";

import { QueryFolderType } from "@/src/libs/types";
import { handleDeleteFolder } from "@/src/utils/apiCalls/folder/handleDeleteFolder";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

/**
 * DeleteFolder Component
 *
 * @description
 * This component renders a modal dialog for confirming the deletion of a folder. It uses the UIModal component to
 * provide the modal interface and includes buttons to either cancel or confirm the deletion. The deletion process
 * involves an asynchronous API call to delete the folder and then updating the parent component's state based on
 * the result.
 *
 * @props
 * @param {QueryFolderType} folder - The folder object that is to be deleted.
 * @param {(deleteFolder: boolean, folder: QueryFolderType) => void} deleteFolder - A callback function to handle
 *        the state update after the folder is deleted. It takes a boolean indicating the success of the deletion
 *        and the folder object that was deleted.
 */
const DeleteFolder = ({
  folder,
  deleteFolder,
}: {
  folder: QueryFolderType;
  deleteFolder: (deleteFolder: boolean, folder: QueryFolderType) => void;
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
   * Handles the confirmation of folder deletion.
   */
  const handleConfirmDeleteFolder = () => {
    const returnedFolder: Promise<boolean> = handleDeleteFolder(folder);

    loadItems(returnedFolder).then((newItem) => {
      deleteFolder(newItem, folder);
    });
  };

  return (
    <UIModal
      body={
        <p className="text-primary text-lg">
          Are you sure you want to delete this folder?
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
            onClick={() => {
              handleConfirmDeleteFolder();
              onClose();
            }}
          >
            Yes
          </UIButton>
        </>
      )}
    ></UIModal>
  );
};

export default DeleteFolder;
