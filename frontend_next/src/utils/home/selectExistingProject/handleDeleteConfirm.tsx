import { ProjectType } from "@/src/libs/types";

export const handleDeleteConfirm = async (
  deletingElement: ProjectType | null,
  setDeletingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>,
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>,
  elements: ProjectType[]
): Promise<void> => {
  if (deletingElement) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects/${deletingElement.projectId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      } else {
        const updatedElements = elements.filter(
          (el) => el.projectId !== deletingElement.projectId
        );
        setElements(updatedElements);
        setDeletingElement(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }
};
