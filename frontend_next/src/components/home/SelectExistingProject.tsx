import React, { useState } from "react";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";

type SelectExistingProjectProps = {};

const SelectExistingProject: React.FC<SelectExistingProjectProps> = ({}) => {
  console.log("SelectExistingProject");
  type Element = {
    name: string;
    value: string;
  };

  const [elements, setElements] = useState<Element[]>([
    { name: "Element 1", value: "Object1" },
    { name: "Element 2", value: "Object2" },
    { name: "Element 3", value: "Object3" },
  ]);
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [editingElement, setEditingElement] = useState<Element | null>(null);
  const [deletingElement, setDeletingElement] = useState<Element | null>(null);

  const handleElementClick = (element: Element) => {
    if (!selectedElements.find((el) => el.value === element.value)) {
      setSelectedElements([...selectedElements, element]);
      // Here you can add the code to request the object from the backend using element.value
    }
  };

  const handleIconClick1 = (element: Element) => {
    setEditingElement(element);
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    element: Element
  ) => {
    // Update the name of the element
    const updatedElements = elements.map((el) =>
      el.value === element.value ? { ...el, name: event.target.value } : el
    );
    setElements(updatedElements);
  };

  const handleEditSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    element: Element
  ) => {
    event.preventDefault();
    // Submit the changes here
    console.log(`Updated name for ${element.name}`);
    setEditingElement(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingElement) {
      const updatedElements = elements.filter(
        (el) => el.value !== deletingElement.value
      );
      setElements(updatedElements);
      console.log(`Deleted ${deletingElement.name}`);
      setDeletingElement(null);
    }
  };

  return (
    <>
      {elements.map((element, index) => (
        <div
          data-testid="select-exising-project-modal"
          key={index}
          className={`flex justify-between items-center text-black ${
            index % 2 === 0 ? "even-element" : ""
          }`}
        >
          {editingElement && editingElement.value === element.value ? (
            <form onSubmit={(event) => handleEditSubmit(event, element)}>
              <input
                type="text"
                value={element.name}
                onChange={(event) => handleEditChange(event, element)}
                autoFocus
                className="focus:outline-none"
              />
            </form>
          ) : (
            <span onClick={() => handleElementClick(element)}>
              {element.name}
            </span>
          )}
          <div className="flex">
            <LuPenSquare onClick={() => handleIconClick1(element)} />
            <UIModal
              button={({ onOpen }) => (
                <button
                  onClick={() => {
                    setDeletingElement(element);
                    onOpen();
                  }}
                >
                  <LuTrash2></LuTrash2>
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
                      handleDeleteConfirm();
                      onClose();
                    }}
                  >
                    Yes
                  </UIButton>
                </>
              )}
            ></UIModal>
          </div>
        </div>
      ))}
      <h2>Selected Elements</h2>
      {selectedElements.map((element, index) => (
        <div key={index}>{element.name}</div>
      ))}
    </>
  );
};

export default SelectExistingProject;
