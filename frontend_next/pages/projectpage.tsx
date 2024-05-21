import React from "react"
import SideBarView2 from "@/views/sideBar/SideBarView2"
import HeaderFunct from "./component"

function ProjectPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HeaderFunct />
      <div style={{ flex: 1, display: "flex" }}>
        <SideBarView2 />
        {/* Add other components or content here if needed */}
      </div>
    </div>
  )
}

export default ProjectPage
