import { Element, ProjectType } from "@/src/libs/types";

export const fetchElements = async (
  setElements: React.Dispatch<React.SetStateAction<Element[]>>
) => {
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
