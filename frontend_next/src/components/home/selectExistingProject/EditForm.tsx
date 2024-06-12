import React, { useState } from "react";
import { handleEditSubmit } from "@/src/utils/home/selectExistingProject/handleEditSubmit";
import { Element } from "@/src/libs/types";
import { useProjectProps } from "@/src/contexts/ProjectContext";

type EditFormProps = {
  element: Element;
  setEditingElement: React.Dispatch<React.SetStateAction<Element | null>>;
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
  elements: Element[];
};

const EditForm: React.FC<EditFormProps> = ({
  element,
  setEditingElement,
  setElements,
  elements,
}) => {
  const [prevElementState] = useState<Element>(element);
  const { setProjectName } = useProjectProps();

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    element: Element
  ) => {
    const updatedElements = elements.map((el) =>
      el.projectId === element.projectId
        ? { ...el, projectName: event.target.value }
        : el
    );
    setElements(updatedElements);
  };

  return (
    <form
      onSubmit={(event) =>
        handleEditSubmit(
          event,
          element,
          setEditingElement,
          setElements,
          elements,
          prevElementState,
          setProjectName
        )
      }
    >
      <input
        type="text"
        value={element.projectName}
        onChange={(event) => handleEditChange(event, element)}
        autoFocus
        className="focus:outline-none"
      />
    </form>
  );
};

export default EditForm;
