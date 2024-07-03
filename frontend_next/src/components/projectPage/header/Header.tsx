import Link from "next/link";
import React from "react";

import ProjectInfoCard from "./ProjectInfoCard";

import { useProjectProps } from "@/src/contexts/ProjectContext";
import { useProps } from "@/src/contexts/PropsContext";
import { useQueryProps } from "@/src/contexts/QueryContext";

/**
 * Header Component
 *
 * @description
 * The Header component renders a navigation bar at the top of the page. It includes a Capgemini logo that links to
 * the home page and optionally displays project information if specified.
 *
 * @props
 * @param {boolean} [showProject] - Flag indicating whether to display the project information card.
 */
const Header = ({ showProject }: { showProject?: boolean }) => {
  const { resetQueryContext } = useQueryProps();
  const { resetProject } = useProjectProps();
  const { resetProps } = useProps();

  /**
   * Reset Context
   *
   * @description
   * Resets the query, project, and props contexts when the Capgemini logo is clicked.
   */
  const resetContext = () => {
    resetQueryContext();
    resetProject();
    resetProps();
  };

  return (
    <div
      className="bg-capgemini-gray h-30 flex items-center justify-between px-6 border-b border-gray-300 shadow-lg z-10"
      data-testid="header"
    >
      <Link href="/" legacyBehavior>
        <a onClick={() => resetContext()}>
          <img
            alt="Capgemini Logo"
            className="cursor-pointer"
            data-testid="capgemini-logo"
            height={400}
            src="https://querify-frontend.vercel.app/images/blackminiNG.png"
            width={200}
          />
        </a>
      </Link>
      {showProject && <ProjectInfoCard />}
    </div>
  );
};

export default Header;
