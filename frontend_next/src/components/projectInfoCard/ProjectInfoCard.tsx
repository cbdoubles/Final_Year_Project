// ProjectInfoCard.tsx
import { Card } from "@nextui-org/react";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import { useProjectProps } from "@/src/contexts/ProjectContext";

const ProjectInfoCard = () => {
  const { projectName, projectId, graphName } = useProjectProps();

  return (
    <Card className="justify-center p-4 rounded-lg w-auto h-20">
      <p className="text-sm text-black">Project: {`${projectName}`}</p>
      <p className="text-sm text-black">Graph File: {`${graphName}`}</p>
      <p className="text-sm text-black">Project ID: {`${projectId}`}</p>
      <div className="flex justify-end w-full">
        {/* <button onClick={() => alert("Edit button clicked")}>
          <LuPenSquare className="h-5 w-5 mr-2 cursor-pointer" />
        </button>
        <button onClick={() => alert("Trash button clicked")}>
          <LuTrash2 className="h-5 w-5 cursor-pointer" />
        </button> */}
      </div>
    </Card>
  );
};

export default ProjectInfoCard;
