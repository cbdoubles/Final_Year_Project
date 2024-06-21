import React from "react";
import Link from "next/link";
import ProjectInfoCard from "../projectInfoCard/ProjectInfoCard";
import { useProjectProps } from "../../contexts/ProjectContext";
import { useQueryProps } from "../../contexts/QueryContext";
import { useProps } from "../../contexts/PropsContext";

const Header = ({ showProject }: { showProject?: boolean }) => {
  // const { projectId, setProjectId, setProjectName, setGraphName } =
  //   useProjectProps();
  const { resetQueryContext } = useQueryProps();
  const { resetProject } = useProjectProps();
  const { resetProps } = useProps();

  const resetContext = () => {
    // setProjectId(1); // or any default value
    // setProjectName("");
    // setGraphName("");
    resetQueryContext();
    resetProject();
    resetProps();
  };

  return (
    <div
      data-testid="header"
      className="bg-capgemini-gray h-30 flex items-center justify-between px-6 border-b border-gray-300 shadow-lg z-10"
    >
      <Link href="/" legacyBehavior>
        <a onClick={() => resetContext()}>
          <img
            src={"/images/blackminiNG.png"}
            alt="Capgemini Logo"
            width={200}
            height={400}
            className="cursor-pointer"
            data-testid="capgemini-logo"
          />
        </a>
      </Link>
      {showProject && <ProjectInfoCard />}
    </div>
  );
};

export default Header;
