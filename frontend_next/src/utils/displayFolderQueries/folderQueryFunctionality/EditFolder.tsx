import { useState } from "react";
import { LuPenSquare } from "react-icons/lu";
import UIModal from "@/src/utils/ui/UIModal";
import UIButton from "@/src/utils/ui/UIButton";
import { QueryFolderType } from "@/src/libs/types";
import { handleEditFolder } from "@/src/utils/apiCalls/folder/handleEditFolder";

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
    folder = { ...folder, folderName: folderName }; // update folder on save
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
