import { useState, MouseEvent } from "react";
import {
  LuTrash2,
  LuFolder,
  LuCornerDownRight,
  LuShare,
  LuPenSquare,
} from "react-icons/lu";
import CustomPopUp from "@/views/PopUps/CustomPopUp";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { QueryFolderListType } from "@/src/libs/types";

const SelectGroup = ({
  item,
  canBeShared,
  handlerClick,
  handlerTrashClick,
}: {
  item: QueryFolderListType;
  type: string;
  canBeShared: boolean;
  handlerClick: (event: MouseEvent) => void;
  handlerTrashClick: (favorite: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  const [selectedFavorite, setSelectedFavorite] = useState("");

  // Implement deleteing a file
  const handleConfirmDelete = () => {
    handlerTrashClick(selectedFavorite);
  };

  return (
    <div className={"bg-sky-600"}>
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer text-white flex items-center gap-1"
      >
        <LuFolder className="ml-2 text-white" />
        {item.folder.folderName}
      </button>
      {item.queries.length > 0 && open && (
        <div className="w-full">
          {item.queries.map((queries, key) => (
            <div
              className={`w-full flex items-center px-8 justify-between ${
                key % 2 === 0 ? "bg-sky-100" : "bg-white"
              }`}
              key={queries.queryId}
              onClick={handlerClick}
            >
              <button className="flex gap-1 items-center">
                <LuCornerDownRight className="text-gray-600" />
                <p className="cursor-pointer text-black capitalize">
                  {queries.queryName}
                </p>
              </button>
              <div className="flex gap-2 ">
                <button>
                  {canBeShared && <LuShare className="text-black" />}
                </button>

                <UIModal
                  button={({ onOpen }) => (
                    <button onClick={onOpen}>
                      <LuPenSquare className="text-black" />
                    </button>
                  )}
                  header={
                    <span className="text-primary">Edit chosen query</span>
                  }
                  body={<CustomPopUp></CustomPopUp>}
                  footer={({ onClose }) => (
                    <UIButton onClick={onClose}>save</UIButton>
                  )}
                ></UIModal>

                <UIModal
                  button={({ onOpen }) => (
                    <button onClick={onOpen}>
                      <LuTrash2 className="text-black"></LuTrash2>
                    </button>
                  )}
                  body={
                    <p className="text-primary text-lg">
                      Are you sure you want to delete this project?
                    </p>
                  }
                  footer={({ onClose }) => (
                    <>
                      <UIButton className="bg-danger" onClick={onClose}>
                        Cancel
                      </UIButton>
                      <UIButton
                        className="bg-success-700"
                        onClick={handleConfirmDelete}
                      >
                        Yes
                      </UIButton>
                    </>
                  )}
                ></UIModal>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectGroup;
