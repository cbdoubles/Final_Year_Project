import { Cog6ToothIcon } from "@heroicons/react/24/outline"
/*import DefaultIcon from  '/public/sidebarImages/defaulticon.png';*/

//Detail for icon
const properties = {
  name: "Settings",
  href: "/sideBar",
  icon: Cog6ToothIcon
}

export default function Settings() {
  const LinkIcon = properties.icon
  return (
    <a
      key={properties.name}
      href={properties.href}
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <LinkIcon className="w-6" />
      <p className="hidden md:block">{properties.name}</p>
    </a>
  )
}
