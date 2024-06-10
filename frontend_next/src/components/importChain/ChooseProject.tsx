import React, { useState } from "react";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import QueryIcon from "@/src/utils/sideBar/QueryIcon";
import CustomIcon from "@/src/utils/sideBar/CustomIcon";

type ChooseProjectProps = {};

const ChooseProjectProps: React.FC<ChooseProjectProps> = ({}) => {
  type Element = {
    name: string;
    value: string;
  };

  const handleClose = () => {
    console.log("Close button clicked");
  };
  
  const [elements, setElements] = useState<Element[]>([
    { name: "Element 1", value: "Object1" },
    { name: "Element 2", value: "Object2" },
    { name: "Element 3", value: "Object3" },
  ]);

  return (
    <>
      {elements.map((element, index) => (
        <div
          data-testid="select-exising-project-modal"
          key={index}
          className={`flex justify-between items-center text-black `}
        >
          <div className=" flex-collumn">
            <UIModal
              button={({ onOpen }) => (
                <UIButton color = "primary" onClick = {onOpen} className = "rounded-none w-80 ">
                  <div key={index}>{element.name}</div>
                </UIButton>
              )}
              footer={({ onClose }) => (
                <></>
              )} body={<CustomIcon/>}>
              </UIModal>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChooseProjectProps;
