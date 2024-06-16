import UIModal from "@/components/ui/UIModal";
import UIButton from "@/components/ui/UIButton";
import { FolderType, QueryType } from "@/src/libs/types";
import { LuTrash2 } from "react-icons/lu";
import { handleDeleteQuery } from "@/src/utils/sideBar/fetches/handleDeleteQuery";

const DeleteQuery = ({
  query,
  deleteQuery,
  type,
}: {
  query: QueryType;
  deleteQuery: (deletingQuery: boolean, deleteQuery: QueryType) => void;
  type: FolderType;
}) => {
  const loadItems = async (deleted: Promise<boolean>) => {
    await new Promise((r) => setTimeout(r, 200));
    return deleted;
  };

  const handleConfirmDeleteQuery = () => {
    const returnedFolder: Promise<boolean> = handleDeleteQuery(query, type);

    loadItems(returnedFolder).then((newItem) => {
      deleteQuery(newItem, query);
    });
    deleteQuery(true, query);
    console.log("in handling delete query");
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
