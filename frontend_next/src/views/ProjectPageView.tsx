import React, { ReactNode, useState, useEffect } from "react";
import Header from "@/src/components/header/Header";
import QueryTextboxAdvanced from "@/src/components/queryTextbox/queryTextboxAdvanced/QueryTextboxAdvanced";
import SideBar from "../components/sideBar/SideBar";
import { useProps } from "../contexts/PropsContext";
import QueryTextbox from "@/src/components/queryTextbox/queryTextboxBasic/QueryTextbox";
import { Card } from "@nextui-org/react";
import { useProjectProps } from "../contexts/ProjectContext";
import { NeoVisProvider } from "@/components/neovisGraph/NeoVisContext";
import NeovisComponent from "@/components/neovisGraph/NeovisComponent";

interface ProjectPageViewProps {
  children: ReactNode;
}

const ProjectPageView = ({ children }: ProjectPageViewProps) => {
  const { advancedMode, queryRunClicked, setQueryRunTrue, setQueryRunFalse } =
    useProps();
  const { projectId, projectName } = useProjectProps();
  const [queryRunClicked2, setQueryRunClicked2] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const [isTableView, setIsTableView] = useState(false);

  const [query, setQuery] = useState("");
  const [localQuery, setLocalQuery] = useState("");

  const handleRunQuery = (query: string) => {
    setLocalQuery(query);
    setQuery(query);
    setQueryRunTrue();
  };

  return (
    <div className="flex flex-col h-screen">
      <Header showProject />
      <div
        className={`w-full h-full grid tr ${
          collapsed ? "grid-cols-[80px,1fr]" : "grid-cols-[300px,1fr]"
        }`}
      >
        <NeoVisProvider>
          {/* <GraphDataProvider> */}
          <div className="w-full">
            <SideBar
              collapsed={collapsed}
              handlerCollapsed={setCollapsed}
              isTableView={isTableView}
            />
          </div>
          <div className="grid-cols-1 p-4 h-full w-full">
            {advancedMode ? (
              <QueryTextboxAdvanced setQuery={handleRunQuery} />
            ) : (
              <QueryTextbox setQueryToRun={handleRunQuery} />
            )}
            <div className="flex-grow overflow-auto">{children}</div>
            {queryRunClicked && (
              <Card className="flex-grow bg-capgemini-gray mt-4 p-2">
                <NeovisComponent
                  query={localQuery}
                  setIsTableView={setIsTableView}
                  isTableView={isTableView}
                />
              </Card>
            )}
          </div>
          {/* </GraphDataProvider> */}
        </NeoVisProvider>
      </div>
    </div>
  );
};

export default ProjectPageView;
