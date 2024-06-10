import React, { useState, useEffect } from "react";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import UIButton from "../ui/UIButton";
import UIModal from "../ui/UIModal";
import { useProjectProps } from "@/src/contexts/ProjectContext";

type SelectExistingProjectProps = {};

const projects = [
  { projectId: "40", projectName: "Ana" },
  { projectId: "Object2", projectName: "Project 2" },
  { projectId: "Object3", projectName: "Project 3" },
];

const SelectExistingProject: React.FC<SelectExistingProjectProps> = ({}) => {
  type Element = {
    projectId: string;
    projectName: string;
  };

  type ProjectType = {
    id: string;
    name: string;
  };

  const defaultElement: Element = {
    projectId: "",
    projectName: "",
  };

  const [prevElementState, setPrevElementState] =
    useState<Element>(defaultElement);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null); // Single selected element
  const [editingElement, setEditingElement] = useState<Element | null>(null);
  const [deletingElement, setDeletingElement] = useState<Element | null>(null);

  const { setProjectId, setProjectName } = useProjectProps();

  useEffect(() => {
    // TO TRY CODE BELOW FOR UseEffect WHEN CONNECTING WITH BACKEND
    // Replace with your backend API call
    const fetchElements = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/projects/"); // Adjust the API endpoint accordingly
        const data: ProjectType[] = await response.json();

        // Transform data from ProjectType[] to Element[]
        const transformedData: Element[] = data.map((project) => ({
          projectId: project.id,
          projectName: project.name,
        }));

        setElements(transformedData);
      } catch (error) {
        console.error("Error fetching elements:", error);
      }
    };

    fetchElements();
  }, []);

  const handleElementClick = (element: Element) => {
    setSelectedElement(element); // Set the selected element
    // Set projectId and projectName in context
    setProjectId(element.projectId);
    setProjectName(element.projectName);
    // Here you can add the code to request the object from the backend using element.projectId
  };

  const handleIconClick1 = (element: Element) => {
    setPrevElementState(element); //used in event updated name is not valid
    setEditingElement(element);
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    element: Element
  ) => {
    // Update the name of the element
    const updatedElements = elements.map((el) =>
      el.projectId === element.projectId
        ? { ...el, projectName: event.target.value }
        : el
    );
    setElements(updatedElements);
  };

  // TO BE USED AS handleEditSubmit WHEN WE CONNECT FE AND BE
  const handleEditSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    element: Element
  ) => {
    event.preventDefault();

    setEditingElement(null);

    try {
      // Construct the URL with the project ID
      const formData = new FormData();
      formData.append("name", element.projectName);

      const response = await fetch(
        `http://localhost:8000/api/projects/${element.projectId}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        // If the API request is not successful, throw an error
        const errorData = await response.json();
        console.log("response not ok");
        throw new Error(errorData.error || "Unknown error");
      }
    } catch (error) {
      // If an error occurs during the API request (e.g., network error or backend error),
      // log the error and revert the elements state to its previous state
      console.error("Error updating project name:", error);

      const updatedElements = elements.map((element) =>
        element.projectId === prevElementState.projectId
          ? prevElementState
          : element
      );
      setElements(updatedElements);
    }

    setProjectId(element.projectId);
    setProjectName(element.projectName);
  };

  const handleDeleteConfirm = async () => {
    if (deletingElement) {
      try {
        // Construct the URL with the project ID
        const formData = new FormData();
        formData.append("name", deletingElement.projectName);

        console.log("first fetch");
        const response = await fetch(
          `http://localhost:8000/api/projects/${deletingElement.projectId}/`,
          {
            method: "DELETE",
            body: formData,
          }
        );

        if (!response.ok) {
          // If the API request is not successful, throw an error
          const errorData = await response.json();
          console.log("response not ok");
          throw new Error(errorData.error || "Unknown error");
        } else {
          const updatedElements = elements.filter(
            (el) => el.projectId !== deletingElement.projectId
          );
          setElements(updatedElements);
          console.log(`Deleted ${deletingElement.projectName}`);
          setDeletingElement(null);
        }
      } catch (error) {
        // If an error occurs during the API request (e.g., network error or backend error),
        // log the error and revert the elements state to its previous state
        console.error("Error updating project name:", error);
      }
    }
  };

  return (
    <>
      {elements.map((element, index) => (
        <div
          data-testid="select-existing-project-modal"
          key={index}
          className={`flex justify-between items-center text-black p-2 cursor-pointer ${
            selectedElement?.projectId === element.projectId
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => handleElementClick(element)} // Attach click handler to div
        >
          {editingElement && editingElement.projectId === element.projectId ? (
            <form onSubmit={(event) => handleEditSubmit(event, element)}>
              <input
                type="text"
                value={element.projectName}
                onChange={(event) => handleEditChange(event, element)}
                autoFocus
                className="focus:outline-none"
              />
            </form>
          ) : (
            <span>{element.projectName}</span>
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
                      handleDeleteConfirm();
                      onClose();
                    }}
                  >
                    Yes
                  </UIButton>
                </>
              )}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default SelectExistingProject;
