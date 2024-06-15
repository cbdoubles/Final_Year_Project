import UIModal from "@/components/ui/UIModal";
import UIButton from "@/components/ui/UIButton";
import CustomPopUp from "@/views/PopUps/CustomPopUp";
import { LuPenSquare } from "react-icons/lu";

const EditQuery = () => {
  const handleSave = () => {
    console.log("Saving the edited query");
    // Implement the save functionality here
  };

  return (
    <UIModal
      button={({ onOpen }) => (
        <button onClick={onOpen}>
          <LuPenSquare className="text-black" />
        </button>
      )}
      header={<span className="text-primary">Edit chosen query</span>}
      body={<CustomPopUp />}
      footer={({ onClose }) => (
        <UIButton
          onClick={() => {
            handleSave();
            onClose();
          }}
        >
          Save
        </UIButton>
      )}
    ></UIModal>
  );
};

export default EditQuery;
