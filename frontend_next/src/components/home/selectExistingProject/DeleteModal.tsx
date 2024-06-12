// DeleteModal.tsx
import React from "react";
import UIModal from "@/components/ui/UIModal";
import UIButton from "@/components/ui/UIButton";
import { LuTrash2 } from "react-icons/lu";
import { handleDeleteConfirm } from "@/src/utils/home/selectExistingProject/handleDeleteConfirm";
import { Element } from "@/src/libs/types";

type DeleteModalProps = {
  element: Element;
  deletingElement: Element | null;
  setDeletingElement: React.Dispatch<React.SetStateAction<Element | null>>;
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
  elements: Element[];
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
