import React, { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import UIModal from "@/src/utils/ui/UIModal";
import { ProjectType } from "@/src/libs/types";
import { fetchProjects } from "@/utils/apiCalls/project/fetchProjects";
import { toast } from "react-toastify";
import ChooseProject from "@/src/components/projectPage/sideBar/icons/importQuery/ChooseProject";
import SelectFolderType from "@/src/components/projectPage/sideBar/icons/importQuery/SelectFolderType";

export default function ImportIcon({ collapsed }: { collapsed: boolean }) {
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  );

  const openSelectProject = async (onOpen: () => void) => {
    const result = await fetchProjects();
    console.log("Fetched folders:", result);
    if (result) {
      setProjects(result);
      onOpen();
    } else {
      toast.error("No query selected");
    }
  };

  const onCloseReset = (onClose: () => void) => {
    setSelectedProject(null);
    onClose();
  };

  return (
    <div>
      <UIModal
        button={({ onOpen }) => (
          <button
            data-testid="ui-button"
            className="w-full flex relative h-[48px] grow items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
            onClick={() => openSelectProject(onOpen)}
          >
            <ArrowDownTrayIcon className="w-6" />
            {!collapsed && (
              <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
                Import
              </p>
            )}
          </button>
        )}
        header={<p className="text-primary">Select Project</p>}
        body={
          <ChooseProject
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        }
        footer={({ onClose }) =>
          selectedProject !== null && (
            <SelectFolderType
              projectId={selectedProject.projectId}
              onCloseChooseProject={() => onCloseReset(onClose)}
              folderTypes={["Custom", "Favorite"]}
              selectedProject={selectedProject}
            />
          )
        }
      />
    </div>
  );
}
