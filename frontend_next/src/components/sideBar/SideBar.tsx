import React from "react";
import SwitchMode from "@/src/utils/sideBar/SwitchModeIcon";
import CustomButton from "@/src/utils/sideBar/CustomIcon";
import FavouriteIcon from "@/src/utils/sideBar/FavouriteIcon";
import Default from "@/src/utils/sideBar/DefaultIcon";
import Reupload from "@/src/utils/sideBar/ReuploadIcon";
import { LuAlignJustify } from "react-icons/lu";
import QueryIconButton from "@/src/utils/sideBar/QueryIconButton";
import GraphToolBoxContainer from "@/components/graphDisplay/GraphToolBoxContainer";
import { Card } from "@nextui-org/react";
import { useProps } from "@/src/contexts/PropsContext";
import UIModal from "../ui/UIModal";
import UIButton from "../ui/UIButton";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
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
          type={"Import"}
          icon={LuAlignJustify}
        />
        <FavouriteIcon collapsed={collapsed} />
        <CustomButton collapsed={collapsed} />
        <Default collapsed={collapsed} />
        <Reupload collapsed={collapsed} />
        <SwitchMode collapsed={collapsed} />

        <UIModal
          button={({ onOpen }) => (
            <QueryIconButton
              handleClick={() => {
                onOpen();
              }}
              collapsed={collapsed}
              type={"Import"}
              icon={ArrowDownTrayIcon}
            />
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
