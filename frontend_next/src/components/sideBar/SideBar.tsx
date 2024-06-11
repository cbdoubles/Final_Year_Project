import React from "react";
import SwitchMode from "@/src/utils/sideBar/SwitchModeIcon";
import CustomButton from "@/src/utils/sideBar/CustomIcon";
import Favourite from "@/src/utils/sideBar/FavouriteIcon";
import Default from "@/src/utils/sideBar/DefaultIcon";
import Reupload from "@/src/utils/sideBar/ReuploadIcon";
// import Import from "@/src/utils/sideBar/ImportIcon";
import { LuAlignJustify } from "react-icons/lu";
import QueryIconButton from "@/src/utils/sideBar/QueryIconButton";
import GraphToolBoxContainer from "@/components/graphDisplay/GraphToolBoxContainer";
import { Card } from "@nextui-org/react";
import { useProps } from "@/src/contexts/PropsContext";
import UIModal from "../ui/UIModal";
import UIButton from "../ui/UIButton";
// import FavouritePopUp from "@/src/views/PopUps/FavoritePopUp";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
// import SelectExistingProject from "../home/selectExistingProject/SelectExistingProject";
// import ChooseProjectProps from "../importChain/ChooseProject";
import ChooseProject from "../importChain/ChooseProject";

export default function SideBar({
  collapsed,
  handlerCollapsed,
}: {
  collapsed: boolean;
  handlerCollapsed: (collapsed: boolean) => void;
}) {
  const { queryRunClicked } = useProps();

  return (
    <div className="bg-white border-r-1 grid grid-cols-1 h-full p-4 items-start">
      <div className="w-full grid grid-cols-1 gap-2">
        <QueryIconButton
          handleClick={() => handlerCollapsed(!collapsed)}
          collapsed={collapsed}
          type={"Collapse"}
          icon={LuAlignJustify}
        />
        <Favourite collapsed={collapsed} />
        <CustomButton collapsed={collapsed} />
        <Default collapsed={collapsed} />
        <Reupload collapsed={collapsed} />
        <SwitchMode collapsed={collapsed} />

        <UIModal
          button={({ onOpen }) => (
            <UIButton
              name="Import"
              collapsed={collapsed}
              className="flex h-[48px] grow items-center justify-center relative gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
              onClick={onOpen}
            >
              <ArrowDownTrayIcon className="mr-2 h-6 w-6" />
            </UIButton>
          )}
          header={<span className="text-primary">Select source</span>}
          body={<ChooseProject></ChooseProject>}
          footer={({ onClose }) => <></>}
        ></UIModal>
        {!collapsed && (
          <>
            {queryRunClicked && (
              <Card className="bg-gray-50">
                <GraphToolBoxContainer />
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
