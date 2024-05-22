import SideBar2 from "@/src/components/sideBar/SideBar"

export default function SideBarView2() {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideBar2 />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12"></div>
    </div>
  )
}
