import { Element } from "@/src/libs/types";
import { toast } from "react-toastify";

export const handleEditSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  element: Element,
  setEditingElement: React.Dispatch<React.SetStateAction<Element | null>>,
  setElements: React.Dispatch<React.SetStateAction<Element[]>>,
  elements: Element[],
  prevElementState: Element,
  setProjectName: (name: string) => void
): Promise<void> => {
  event.preventDefault();
  setEditingElement(null);

  try {
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error");
    } else {
      setProjectName(element.projectName);
    }
  } catch (error) {
    console.error("Error updating project name:", error);

    const updatedElements = elements.map((el) =>
      el.projectId === prevElementState.projectId ? prevElementState : el
    );
    setElements(updatedElements);
    setProjectName(prevElementState.projectName); // Set project name to the previous name
    toast.error("This name already exists", {
      position: "top-right",
      theme: "colored",
    });
  }
};
