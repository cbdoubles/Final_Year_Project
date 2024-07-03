import React, { useState } from "react";
import { toast } from "react-toastify";

import { useProjectProps } from "@/src/contexts/ProjectContext";
import { ProjectType } from "@/src/libs/types";
import { handleEditSubmit } from "@/src/utils/apiCalls/project/handleEditProject";

type EditFormProps = {
  element: ProjectType;
  setEditingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  elements: ProjectType[];
};

/**
 * EditForm Component
 *
 * @description
 * This component renders a form for editing a project's name. It allows users to input a new project name and handles
 * submission to update the project's name via API calls. It manages state for the input value and handles potential
 * errors such as name duplication.
 *
 * @props
 * @param {ProjectType} element - The project element to be edited.
 * @param {React.Dispatch<React.SetStateAction<ProjectType | null>>} setEditingElement - Function to set the element currently being edited (null if no editing in progress).
 * @param {React.Dispatch<React.SetStateAction<ProjectType[]>>} setElements - Function to update the list of project elements after editing.
 * @param {ProjectType[]} elements - Current list of project elements.
 *
 * @state
 * @typedef {ProjectType} prevElementState - State to store the previous state of the project element before editing.
 * @typedef {string} inputValue - State to store the current input value of the project name.
 */
const EditForm: React.FC<EditFormProps> = ({
  element,
  setEditingElement,
  setElements,
  elements,
}) => {
  const [prevElementState] = useState<ProjectType>(element);
  const { setProjectName } = useProjectProps();
  const [inputValue, setInputValue] = useState(element.projectName);

  /**
   * Handles changes to the input field for editing the project name.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object containing the new input value.
   */
  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    const updatedElements = elements.map((el) =>
      el.projectId === element.projectId
        ? { ...el, projectName: event.target.value }
        : el
    );
    setElements(updatedElements);
  };

  /**
   * Handles submission of the edit form. Reverts to previous element name if there is an error.
   *
   * @param {React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>} event - The event object triggering the submission.
   */
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
        className="focus:outline-none"
        type="text"
        value={inputValue}
        autoFocus
        onBlur={handleSubmit}
        onChange={handleEditChange}
      />
    </form>
  );
};

export default EditForm;
