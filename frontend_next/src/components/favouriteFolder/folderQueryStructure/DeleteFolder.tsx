import { LuTrash2 } from "react-icons/lu";
import UIModal from "@/components/ui/UIModal";
import UIButton from "@/components/ui/UIButton";
import { QueryFolderType } from "@/src/libs/types";
import { handleDeleteFolder } from "@/src/utils/sideBar/fetches/handleDeleteFolder";

const DeleteFolder = ({
  folder,
  deleteFolder,
}: {
  folder: QueryFolderType;
  deleteFolder: (deleteFolder: boolean, folder: QueryFolderType) => void;
}) => {
  const loadItems = async (deleted: Promise<boolean>) => {
    await new Promise((r) => setTimeout(r, 200));
    return deleted;
  };

  const handleConfirmDeleteFolder = () => {
    const returnedFolder: Promise<boolean> = handleDeleteFolder(folder);

    loadItems(returnedFolder).then((newItem) => {
      deleteFolder(newItem, folder);
    });
  };

  return (
    <UIModal
      button={({ onOpen }) => (
        <button onClick={onOpen}>
          <LuTrash2 className="text-black"></LuTrash2>
        </button>
      )}
      body={
        <p className="text-primary text-lg">
          Are you sure you want to delete this folder?
        </p>
      }
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
