// ProjectInfoCard.tsx
import { Card } from "@nextui-org/react";
import React from "react";

import { useProjectProps } from "@/src/contexts/ProjectContext";

/**
 * ProjectInfoCard Component
 *
 * @description
 * The ProjectInfoCard component displays essential project information, including project name,
 * graph file name, and project ID. This information is retrieved from the ProjectContext using
 * the useProjectProps hook.
 */
const ProjectInfoCard = () => {
  const { projectName, projectId, graphName } = useProjectProps();

  return (
    <Card className="justify-center p-4 rounded-lg w-auto h-20">
      <p className="text-sm text-black">Project: {`${projectName}`}</p>
      <p className="text-sm text-black">Graph File: {`${graphName}`}</p>
      <p className="text-sm text-black">Project ID: {`${projectId}`}</p>
      <div className="flex justify-end w-full"></div>
    </Card>
  );
};

export default ProjectInfoCard;
