// ProjectInfoCard.tsx
import { Card } from "@nextui-org/react"
import { LuTrash2, LuPenSquare } from "react-icons/lu"

const ProjectInfoCard = () => (
  <Card className="justify-center p-4 rounded-lg w-48 h-16">
    <p className="text-sm text-black">Project:</p>
    <p className="text-sm text-black">Graph File:</p>
    <div className="flex justify-end w-full">
      <button onClick={() => alert("Edit button clicked")}>
        <LuPenSquare className="h-5 w-5 mr-2 cursor-pointer" />
      </button>
      <button onClick={() => alert("Trash button clicked")}>
        <LuTrash2 className="h-5 w-5 cursor-pointer" />
      </button>
    </div>
  </Card>
)

export default ProjectInfoCard
