import { ProjectType } from "@/src/libs/types";
// import { useProjectProps } from "@/src/contexts/ProjectContext";

export const handleEditProject = async (
  event: React.FormEvent,
  element: ProjectType,
  setEditingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>,
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>,
  elements: ProjectType[],
  prevElementState: ProjectType,
  setProjectName: React.Dispatch<string>
): Promise<void> => {
  event.preventDefault();
  setEditingElement(null);

  try {
    const formData = new FormData();
    formData.append("name", element.projectName);
    console.log("starting to handle");

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
    console.log("prevElementState");
    console.log(prevElementState);
    setElements(updatedElements);
    console.log(updatedElements);
    setProjectName(prevElementState.projectName); // Set project name to the previous name
  }
};
