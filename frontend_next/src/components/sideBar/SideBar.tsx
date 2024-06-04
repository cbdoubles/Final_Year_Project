import React from "react"
import SwitchMode from "@/src/utils/sideBar/SwitchModeIcon"
import CustomButton from "@/src/utils/sideBar/CustomIcon"
import Favourite from "@/src/utils/sideBar/FavouriteIcon"
import Default from "@/src/utils/sideBar/DefaultIcon"
import Reupload from "@/src/utils/sideBar/ReuploadIcon"
import Settings from "@/src/utils/sideBar/SettingsIcon"
import { LuAlignJustify } from "react-icons/lu"
import QueryIconButton from "@/src/utils/sideBar/QueryIconButton"
import GraphToolBoxContainer from "@/components/graphDisplay/GraphToolBoxContainer"
import { Card } from "@nextui-org/react"
import { useProps } from "@/src/contexts/PropsContext"

export default function SideBar({
  collapsed,
  handlerCollapsed
}: {
  collapsed: boolean
  handlerCollapsed: (collapsed: boolean) => void
}) {
  const { queryRunClicked } = useProps()

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
        <Settings collapsed={collapsed} />
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
  )
}
