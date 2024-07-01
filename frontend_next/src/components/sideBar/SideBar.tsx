import React from "react";
import SwitchMode from "@/src/components/sideBar/icons/SwitchModeIcon";
import CustomButton from "@/components/sideBar/icons/CustomIcon";
import FavouriteIcon from "@/components/sideBar/icons/FavouriteIcon";
import Default from "@/components/sideBar/icons/DefaultIcon";
import Reupload from "@/src/components/sideBar/icons/ReuploadIcon";
import { LuAlignJustify } from "react-icons/lu";
import QueryIconButton from "@/src/utils/sideBar/QueryIconButton";
import { Card } from "@nextui-org/react";
import { useProps } from "@/src/contexts/PropsContext";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import ImportIcon from "@/src/components/sideBar/icons/ImportIcon";
import NeoVisToolBox from "../neovisGraph/NeoVisToolBox";

export default function SideBar({
  collapsed,
  handlerCollapsed,
  isTableView, // Add isTableView prop
}: {
  collapsed: boolean;
  handlerCollapsed: (collapsed: boolean) => void;
  isTableView: boolean; // Add isTableView prop
}) {
  const { queryRunClicked } = useProps();
  const { projectId } = useProjectProps();

  return (
    <div className="bg-white border-r-1 grid grid-cols-1 h-full p-4 items-start">
      <div className="w-full grid grid-cols-1 gap-2">
        <button
          onClick={() => handlerCollapsed(!collapsed)}
          className="w-full flex h-[48px] relative grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <LuAlignJustify className="w-6" />
          {!collapsed && (
            <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
              {"Collapse"}
            </p>
          )}
          {/* <LinkIcon className="w-6" />
          {!collapsed && (
            <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
              {modeName}
            </p>
          )} */}
        </button>
        <FavouriteIcon collapsed={collapsed} projectId={projectId} />
        <CustomButton collapsed={collapsed} projectId={projectId} />
        <Default collapsed={collapsed} />
        <Reupload collapsed={collapsed} />
        <SwitchMode collapsed={collapsed} />
        <ImportIcon collapsed={collapsed} />

        {!collapsed && !isTableView && (
          <>
            {queryRunClicked && (
              <Card className="bg-gray-50">
                <NeoVisToolBox title="Node and Edge Information" />
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
