import { ProjectType, ProjectTypeFetch } from "@/src/libs/types";

export const fetchProjects = async (
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>
) => {
  try {
    const response = await fetch("http://localhost:8000/api/projects/");
    const data: ProjectTypeFetch[] = await response.json();

    // Transform data from ProjectType[] to Element[]
    const transformedData: ProjectType[] = data.map((project) => ({
      projectId: project.id,
      projectName: project.name,
    }));

    setElements(transformedData);
  } catch (error) {
    console.error("Error fetching elements:", error);
  }
};
