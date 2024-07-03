import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-toastify";

import ChooseProject from "@/src/components/projectPage/sideBar/icons/importQuery/ChooseProject";
import SelectFolderType from "@/src/components/projectPage/sideBar/icons/importQuery/SelectFolderType";
import { ProjectType } from "@/src/libs/types";
import UIModal from "@/src/utils/ui/UIModal";
import { fetchProjects } from "@/utils/apiCalls/project/fetchProjects";

/**
 * ImportIcon Component
 *
 * @description
 * This component renders an import button that opens a modal for selecting a project and folder type.
 * It fetches projects from the server and allows the user to choose a project and folder type for importing queries.
 *
 * @props
 * @param {boolean} collapsed - Boolean prop to control if the sidebar is collapsed.
 */
export default function ImportIcon({ collapsed }: { collapsed: boolean }) {
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  );

  /**
   * Open project selection modal
   *
   * @description
   * Fetches the list of projects from the server and opens the project selection modal.
   *
   * @param {() => void} onOpen - Callback function to open the modal.
   */
  const openSelectProject = async (onOpen: () => void) => {
    const result = await fetchProjects();
    if (result) {
      setProjects(result);
      onOpen();
    } else {
      toast.error("No query selected");
    }
  };

  /**
   * Close modal and reset selection
   *
   * @description
   * Resets the selected project and closes the modal.
   *
   * @param {() => void} onClose - Callback function to close the modal.
   */
  const onCloseReset = (onClose: () => void) => {
    setSelectedProject(null);
    onClose();
  };

  /**
   * Render the component
   *
   * @description
   * Renders the import button and modal for selecting a project and folder type. The modal includes
   * a project selection step and a folder type selection step.
   *
   * @returns {JSX.Element} The rendered import icon component.
   */
  return (
    <div>
      <UIModal
        body={
          <ChooseProject
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        }
        button={({ onOpen }) => (
          <button
            className="w-full flex relative h-[48px] grow items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
            data-testid="ui-button"
            data-testid="import-button"
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
        footer={({ onClose }) =>
          selectedProject !== null && (
            <SelectFolderType
              folderTypes={["Custom", "Favorite"]}
              projectId={selectedProject.projectId}
              selectedProject={selectedProject}
              onCloseChooseProject={() => onCloseReset(onClose)}
            />
          )
        }
        header={<p className="text-primary">Select Project</p>}
      />
    </div>
  );
}
