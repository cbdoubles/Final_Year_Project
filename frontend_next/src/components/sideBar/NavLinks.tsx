import {
  StarIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  GlobeAsiaAustraliaIcon
} from "@heroicons/react/24/outline"
/*import DefaultIcon from  '/public/sidebarImages/defaulticon.png';*/

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Favourite", href: "/sideBar", icon: StarIcon },
  { name: "Customised", href: "/sideBar", icon: ClipboardDocumentCheckIcon },
  { name: "Default", href: "/sideBar", icon: GlobeAsiaAustraliaIcon },
  { name: "Switch Mode", href: "/sideBar", icon: UserCircleIcon },
  { name: "Reupload graph data", href: "/sideBar", icon: ArrowPathIcon },
  { name: "Settings", href: "/sideBar", icon: Cog6ToothIcon }
]

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon
        return (
          <a
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </a>
        )
      })}
    </>
  )
}
