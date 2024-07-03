import React from "react";
import UIModal from "@/src/utils/ui/UIModal";
import UIButton from "@/src/utils/ui/UIButton";
import { LuTrash2 } from "react-icons/lu";
import { handleDeleteConfirm } from "@/src/utils/apiCalls/project/handleDeleteProject";
import { ProjectType } from "@/src/libs/types";

type DeleteModalProps = {
  element: ProjectType;
  deletingElement: ProjectType | null;
  setDeletingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  elements: ProjectType[];
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  element,
  deletingElement,
  setDeletingElement,
  setElements,
  elements,
}) => {
  return (
    <UIModal
      button={({ onOpen }) => (
        <button
          onClick={() => {
            setDeletingElement(element);
            onOpen();
          }}
        >
          <LuTrash2 />
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
            onClick={() => {
              handleDeleteConfirm(
                deletingElement,
                setDeletingElement,
                setElements,
                elements
              );
              onClose();
            }}
          >
            Yes
          </UIButton>
        </>
      )}
    />
  );
};

export default DeleteModal;
