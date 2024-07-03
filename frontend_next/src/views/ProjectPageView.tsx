import { Card } from "@nextui-org/react";
import React, { ReactNode, useState } from "react";

import SideBar from "../components/projectPage/sideBar/SideBar";
import { useProps } from "../contexts/PropsContext";

import Header from "@/src/components/projectPage/header/Header";
import QueryTextboxAdvanced from "@/src/components/projectPage/queryTextbox/QueryTextboxAdvanced";
import QueryTextboxBasic from "@/src/components/projectPage/queryTextbox/QueryTextboxBasic";
import NeovisComponent from "@/src/components/projectPage/visualization/neovisGraph/NeovisComponent";
import { NeoVisProvider } from "@/src/contexts/NeoVisContext";

interface ProjectPageViewProps {
  children: ReactNode;
}

/**
 * ProjectPageView Component
 *
 * @description
 * This component renders the project page with a header, sidebar, query textbox (advanced or basic), and a visualization component.
 * It handles the state for sidebar collapse, table view, and query execution.
 *
 * @props
 * @param {ReactNode} children - The children elements to be rendered within the component.
 * @returns {JSX.Element} The rendered project page view component.
 */
const ProjectPageView = ({ children }: ProjectPageViewProps) => {
  const { advancedMode, queryRunClicked, setQueryRunTrue } = useProps();

  const [collapsed, setCollapsed] = useState(false);
  const [isTableView, setIsTableView] = useState(false);

  const [localQuery, setLocalQuery] = useState("");

  /**
   * Handle run query
   *
   * @description
   * Sets the local query and marks the query as run.
   *
   * @param {string} query - The query to be executed.
   */
  const handleRunQuery = (query: string) => {
    setLocalQuery(query);
    setQueryRunTrue();
  };

  /**
   * Render the component
   *
   * @description
   * Renders the project page with a header, sidebar, query textbox (advanced or basic), and a visualization component.
   * Handles the layout for sidebar collapse and query execution state.
   *
   * @returns {JSX.Element} The rendered project page view component.
   */
  return (
    <div className="flex flex-col h-screen">
      <Header showProject />
      <div
        className={`w-full h-full grid tr ${
          collapsed ? "grid-cols-[80px,1fr]" : "grid-cols-[300px,1fr]"
        }`}
      >
        <NeoVisProvider>
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
              <QueryTextboxBasic setQueryToRun={handleRunQuery} />
            )}
            <div className="flex-grow overflow-auto">{children}</div>
            {queryRunClicked && (
              <Card className="flex-grow bg-capgemini-gray mt-4 p-2">
                <NeovisComponent
                  isTableView={isTableView}
                  query={localQuery}
                  setIsTableView={setIsTableView}
                />
              </Card>
            )}
          </div>
        </NeoVisProvider>
      </div>
    </div>
  );
};

export default ProjectPageView;
