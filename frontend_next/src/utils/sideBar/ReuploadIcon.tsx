import { ArrowPathIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
/*import DefaultIcon from  '/public/sidebarImages/defaulticon.png';*/

//Detail for icon
const properties = {
  name: "Reupload graph data",
  href: "/sideBar",
  icon: ArrowPathIcon
}

export default function ReuploadIcon({ collapsed }: { collapsed: boolean }) {
  const LinkIcon = properties.icon
  return (
    <Link
      key={properties.name}
      href={properties.href}
      className="flex h-[48px] grow relative items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <LinkIcon className="w-6" />
      {!collapsed && (
        <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
          {properties.name}
        </p>
      )}
    </Link>
  )
}
