import React from "react";
import Link from "next/link";
import ProjectInfoCard from "../projectInfoCard/ProjectInfoCard";

const Header = ({ showProject }: { showProject?: boolean }) => (
  <>
    <div
      data-testid="header"
      className=" bg-capgemini-gray h-18 flex items-center justify-between px-6 border-b border-gray-300 shadow-lg z-10"
    >
      <Link href="/" legacyBehavior>
        <a>
          <img
            src={"/images/blackminiNG.png"}
            alt="Capgemini Logo"
            width={200}
            height={300}
            className="cursor-pointer"
            data-testid="capgemini-logo"
          />
        </a>
      </Link>
      {showProject && <ProjectInfoCard />}
    </div>
  </>
);

export default Header;
