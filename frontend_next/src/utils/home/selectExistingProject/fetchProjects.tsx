import { ProjectType, ProjectTypeFetch } from "@/src/libs/types";

export const fetchElements = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/projects/");
    const data: ProjectTypeFetch[] = await response.json();

    // Transform data from ProjectType[] to Element[]
    const transformedData: ProjectType[] = data.map((project) => ({
      projectId: project.id,
      projectName: project.name,
      graphName: project.file_name,
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching elements:", error);
  }
};
