import { Card } from "@nextui-org/react";
import React from "react";
import { LuAlignJustify } from "react-icons/lu";

import CustomIcon from "@/src/components/projectPage/sideBar/icons/CustomIcon";
import Default from "@/src/components/projectPage/sideBar/icons/defaultQuery/DefaultIcon";
import FavouriteIcon from "@/src/components/projectPage/sideBar/icons/FavouriteIcon";
import ImportIcon from "@/src/components/projectPage/sideBar/icons/importQuery/ImportIcon";
import Reupload from "@/src/components/projectPage/sideBar/icons/reupload/ReuploadIcon";
import SwitchMode from "@/src/components/projectPage/sideBar/icons/SwitchModeIcon";
import NeoVisToolBox from "@/src/components/projectPage/visualization/neovisGraph/NeoVisToolBox"; //This is for visualization
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { useProps } from "@/src/contexts/PropsContext";

/**
 * SideBar Component
 *
 * @description
 * This component renders a sidebar with various control buttons and icons for project management.
 * It includes options to toggle the collapse state, switch modes, reupload, and import, among others.
 * The sidebar also conditionally renders a toolbox for node and edge information if a query has been run.
 *
 * @props
 * @param {boolean} collapsed - Boolean prop to control if the sidebar is collapsed.
 * @param {(collapsed: boolean) => void} handlerCollapsed - Function to handle the collapse state change.
 * @param {boolean} isTableView - Boolean prop to check if the view is table view.
 */
export default function SideBar({
  collapsed,
  handlerCollapsed,
  isTableView,
}: {
  collapsed: boolean;
  handlerCollapsed: (collapsed: boolean) => void;
  isTableView: boolean;
}) {
  const { queryRunClicked } = useProps();
  const { projectId } = useProjectProps();

  /**
   * Render the component
   *
   * @description
   * Renders the sidebar with buttons and icons. The sidebar includes a toggle for collapsing,
   * several action icons, and conditionally renders a toolbox for node and edge information
   * if a query has been run and the view is not table view.
   *
   * @returns {JSX.Element} The rendered sidebar component.
   */
  return (
    <div className="bg-white border-r-1 grid grid-cols-1 h-full p-4 items-start">
      <div className="w-full grid grid-cols-1 gap-2">
        <button
          className="w-full flex h-[48px] relative grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          onClick={() => handlerCollapsed(!collapsed)}
        >
          <LuAlignJustify className="w-6" />
          {!collapsed && (
            <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
              {"Collapse"}
            </p>
          )}
        </button>
        <FavouriteIcon collapsed={collapsed} projectId={projectId} />
        <CustomIcon collapsed={collapsed} projectId={projectId} />
        <Default collapsed={collapsed} />
        <Reupload collapsed={collapsed} />
        <SwitchMode collapsed={collapsed} />
        <ImportIcon collapsed={collapsed} />

        {!collapsed && !isTableView && (
          <>
            {queryRunClicked && (
              <Card className="bg-gray-50">
                <NeoVisToolBox title="Node and Edge Information" />{" "}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
