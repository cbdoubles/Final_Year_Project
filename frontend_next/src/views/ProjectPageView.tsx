import React, { ReactNode } from "react"
import SideBarView2 from "@/views/sideBar/SideBarView2"
import HeaderFunct from "@/components/Header"
import QueryTextbox from "@/components/QueryTextbox/QueryTextbox"

interface ProjectPageViewProps {
  children: ReactNode
}

const ProjectPageView = ({ children }: ProjectPageViewProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HeaderFunct />
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 1 }}>
          <SideBarView2 />
        </div>
        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <QueryTextbox />
          <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPageView
