import { useState } from "react";
import { LuPenSquare } from "react-icons/lu";
import UIModal from "@/src/utils/ui/UIModal";
import UIButton from "@/src/utils/ui/UIButton";
import { QueryFolderType } from "@/src/libs/types";
import { handleEditFolder } from "@/src/utils/apiCalls/folder/handleEditFolder";

/**
 * @description
 * EditFolder Component
 * This component is responsible for editing the name of a folder. It utilizes a modal for the user to input the new folder name and provides functionality to save the updated name. The component ensures that the folder name is updated both locally and in the backend.
 *
 * @props
 * @param {QueryFolderType} folder - The folder object to be edited.
 * @param {(newFolderName: string) => void} updateFolderName - Function to update the folder name in the parent component's state.
 *
 * @state
 * @param {QueryFolderType} prevState - State to hold the initial state of the folder before any edits. This is used to revert changes if needed.
 * @param {string} folderName - State to hold the currently edited folder name. This state is updated as the user types in the input field.
 *
 * @function
 * @description
 * handleOpen resets the folderName state to the current folder's name when the modal is opened. This ensures that the input field is initialized with the current folder name.
 *
 * @function
 * @param {Promise<QueryFolderType>} queryFolder - A promise that resolves to the updated folder object.
 * @description
 * loadItems simulates a loading delay and then returns the updated folder object. This is used to simulate asynchronous operations, such as fetching data from an API.
 *
 * @function
 * @description
 * fetchUpdateFolderName updates the folder object with the new folder name, calls the API to update the folder in the backend, and then updates the parent component's state with the new folder name.
 *
 * @function
 * @param {React.ChangeEvent<HTMLInputElement>} e - The event object from the input field.
 * @description
 * handleChange updates the folderName state with the value from the input field, allowing the user to edit the folder name.
 *
 */

const EditFolder = ({
  folder,
  updateFolderName,
}: {
  folder: QueryFolderType;
  updateFolderName: (newFolderName: string) => void;
}) => {
  const [prevState] = useState(folder);
  const [folderName, setFolderName] = useState(folder.folderName);

  const handleOpen = () => {
    setFolderName(folder.folderName);
  };

  const loadItems = async (queryFolder: Promise<QueryFolderType>) => {
    await new Promise((r) => setTimeout(r, 200));
    return queryFolder;
  };

  const fetchUpdateFolderName = () => {
    folder = { ...folder, folderName: folderName };
    const returnedFolder: Promise<QueryFolderType> = handleEditFolder(
      folder,
      prevState
    );

    loadItems(returnedFolder).then((newItem) => {
      updateFolderName(newItem.folderName);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };

  return (
    <UIModal
      button={({ onOpen }) => (
        <button
          onClick={() => {
            onOpen();
            handleOpen();
          }}
        >
          <LuPenSquare className="text-black" />
        </button>
      )}
      header={<span className="text-primary">Edit folder name</span>}
      body={
        <input
          className="w-full h-20 p-2 text-lg border rounded border-gray-300 mb-2 mt-5 resize-none text-black"
          value={folderName}
          onChange={handleChange}
        />
      }
      footer={({ onClose }) => (
        <UIButton
          onClick={() => {
            onClose();
            fetchUpdateFolderName();
          }}
        >
          Save
        </UIButton>
      )}
    ></UIModal>
  );
};

export default EditFolder;
