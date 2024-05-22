import Favourite from "@/utils/sideBar/FavouriteIcon"
import Custom from "@/utils/sideBar/CustomIcon"
import Default from "@/utils/sideBar/DefaultIcon"
import SwitchMode from "@/utils/sideBar/SwitchModeIcon"
import Reupload from "@/utils/sideBar/ReuploadIcon"
import Settings from "@/utils/sideBar/SettingsIcon"

export default function SideBar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Favourite />
        <Custom />
        <Default />
        <SwitchMode />
        <Reupload />
        <Settings />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form></form>
      </div>
    </div>
  )
}
