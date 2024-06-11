import React, { ReactNode, useState } from "react";
import Header from "@/src/components/header/Header";
import QueryTextboxAdvanced from "../components/QueryTextboxAdvanced/QueryTextboxAdvanced";
import SideBar from "../components/sideBar/SideBar";
import { useProps } from "../contexts/PropsContext";
import QueryTextbox from "../components/QueryTextbox/QueryTextbox";
import { GraphDataProvider } from "@/components/graphDisplay/GraphDataContext";

interface ProjectPageViewProps {
  children: ReactNode;
}

const ProjectPageView = ({ children }: ProjectPageViewProps) => {
  const { advancedMode } = useProps();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header showProject />
      <div
        className={`w-full h-full grid tr ${
          collapsed ? "grid-cols-[80px,1fr]" : "grid-cols-[300px,1fr]"
        }`}
      >
        <GraphDataProvider>
          <div className="w-full">
            <SideBar collapsed={collapsed} handlerCollapsed={setCollapsed} />
          </div>
          <div className="grid-cols-1 p-4 h-full w-full">
            {advancedMode ? (
              <QueryTextboxAdvanced setQuery={setQuery} />
            ) : (
              <QueryTextbox />
            )}
            <div className="flex-grow overflow-auto">{children}</div>
          </div>
        </GraphDataProvider>
      </div>
    </div>
  );
};

export default ProjectPageView;
