import React, { ReactNode } from "react"
import SideBarView from "@/views/sideBar/SideBarView"
import HeaderFunct from "@/src/components/header/Header"
import QueryTextbox from "@/src/components/queryTextbox/QueryTextbox"

interface ProjectPageViewProps {
  children: ReactNode
}

const ProjectPageView = ({ children }: ProjectPageViewProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HeaderFunct />
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 1 }}>
          <SideBarView />
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
