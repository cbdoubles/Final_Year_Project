import { useState } from "react";
import UIModal from "@/components/ui/UIModal";
import UIButton from "@/components/ui/UIButton";
import { LuTrash2 } from "react-icons/lu";

const DeleteQuery = ({ queryId }: { queryId: number }) => {
  const handleConfirmDeleteQuery = () => {
    console.log("Deleting query with ID:", queryId);
    // Implement the delete functionality here
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
          Are you sure you want to delete this query?
        </p>
      }
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
