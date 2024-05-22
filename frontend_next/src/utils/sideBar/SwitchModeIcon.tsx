import React, { useState } from "react"
/*import { UserCircleIcon } from "@heroicons/react/24/outline"*/
import { UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline"
import { UserMinusIcon } from "@heroicons/react/24/outline"
/*import DefaultIcon from  '/public/sidebarImages/defaulticon.png';*/

//Detail for icon
const properties = {
  name: "Switch Mode",

  href: "/sideBar",
  icon: UserCircleIcon
}

export default function SwitchMode() {
  // State to manage the current icon
  const [isUserPlus, setIsUserPlus] = useState(true)

  // Function to handle the icon switch
  const handleSwitchMode = () => {
    setIsUserPlus((prevState) => !prevState)
  }
  const LinkIcon = isUserPlus ? UserPlusIcon : UserMinusIcon
  return (
    <a
      key={properties.name}
      onClick={handleSwitchMode}
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <LinkIcon className="w-6" />
      <p className="hidden md:block">{properties.name}</p>
    </a>
  )
}
