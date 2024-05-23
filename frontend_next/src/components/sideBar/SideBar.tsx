import React from "react"
import SwitchMode from "@/src/utils/sideBar/SwitchModeIcon"
import CustomButton from "@/src/utils/sideBar/CustomIcon"
import Favourite from "@/src/utils/sideBar/FavouriteIcon"
import Default from "@/src/utils/sideBar/DefaultIcon"
import Reupload from "@/src/utils/sideBar/ReuploadIcon"
import Settings from "@/src/utils/sideBar/SettingsIcon"

export default function SideBar() {
  return (
    <div className="bg-white h-full">
      <Favourite />
      <CustomButton />
      <Default />
      <Reupload />
      <SwitchMode />
      <Settings />
    </div>
  )
}
