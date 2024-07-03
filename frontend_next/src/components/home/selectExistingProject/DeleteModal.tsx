import React from "react";
import { LuTrash2 } from "react-icons/lu";

import { ProjectType } from "@/src/libs/types";
import { handleDeleteConfirm } from "@/src/utils/apiCalls/project/handleDeleteProject";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

type DeleteModalProps = {
  project: ProjectType;
  deletingProject: ProjectType | null;
  setDeletingProject: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  projects: ProjectType[];
};

/**
 * DeleteModal Component
 *
 * @description
 * This component renders a modal for confirming the deletion of a project. It displays a message asking the user
 * to confirm their intention to delete the project and provides buttons for confirmation and cancellation.
 *
 * @props
 * @param {ProjectType} project - The project to be deleted.
 * @param {ProjectType | null} deletingProject - Currently deleting project (null if no deletion in progress).
 * @param {React.Dispatch<React.SetStateAction<ProjectType | null>>} setDeletingProject - Function to set the project currently being deleted.
 * @param {React.Dispatch<React.SetStateAction<ProjectType[]>>} setProjects - Function to update the list of projects after deletion.
 * @param {ProjectType[]} projects - Current list of projects.
 *
 * @state
 * No additional state managed within this component.
 */

const DeleteModal: React.FC<DeleteModalProps> = ({
  project,
  deletingProject,
  setDeletingProject,
  setProjects,
  projects,
}) => {
  return (
    <UIModal
      body={
        <p className="text-primary text-lg">
          Are you sure you want to delete this project?
        </p>
      }
      button={({ onOpen }) => (
        <button
          onClick={() => {
            setDeletingProject(project);
            onOpen();
          }}
        >
          <LuTrash2 />
        </button>
      )}
      footer={({ onClose }) => (
        <>
          <UIButton className="bg-danger" onClick={onClose}>
            Cancel
          </UIButton>
          <UIButton
            className="bg-success-700"
            onClick={() => {
              handleDeleteConfirm(
                deletingProject,
                setDeletingProject,
                setProjects,
                projects
              );
              onClose();
            }}
          >
            Yes
          </UIButton>
        </>
      )}
    />
  );
};

export default DeleteModal;
