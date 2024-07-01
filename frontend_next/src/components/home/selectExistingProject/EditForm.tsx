import React, { useState } from "react";
import { handleEditSubmit } from "@/src/utils/apiCalls/project/handleEditProject";
import { Element, ProjectType } from "@/src/libs/types";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { toast } from "react-toastify";

type EditFormProps = {
  element: ProjectType;
  setEditingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  elements: ProjectType[];
};

const EditForm: React.FC<EditFormProps> = ({
  element,
  setEditingElement,
  setElements,
  elements,
}) => {
  const [prevElementState] = useState<ProjectType>(element);
  const { setProjectName } = useProjectProps();
  const [inputValue, setInputValue] = useState(element.projectName);

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    const updatedElements = elements.map((el) =>
      el.projectId === element.projectId
        ? { ...el, projectName: event.target.value }
        : el
    );
    setElements(updatedElements);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setEditingElement(null);

    try {
      const updatedElement = await handleEditSubmit(
        element.projectId,
        inputValue
      );
      setProjectName(updatedElement.projectName);
    } catch (error) {
      console.error("Error updating project name:", error);

      const updatedElements = elements.map((el) =>
        el.projectId === prevElementState.projectId ? prevElementState : el
      );
      toast.error("This name already exists", {
        position: "top-right",
        theme: "colored",
      });
      setElements(updatedElements);
      setProjectName(prevElementState.projectName);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleEditChange}
        onBlur={handleSubmit}
        autoFocus
        className="focus:outline-none"
      />
    </form>
  );
};

export default EditForm;
