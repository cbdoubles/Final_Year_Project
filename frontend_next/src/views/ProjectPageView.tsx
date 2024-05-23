import React, { ReactNode, useState } from "react"
import HeaderFunct from "@/src/components/header/Header"
import QueryTextbox from "@/src/components/QueryTextbox/QueryTextbox"
import QueryTextboxAdvanced from "../components/QueryTextboxAdvanced/QueryTextboxAdvanced"
import SideBar from "../components/sideBar/SideBar"
import { useProps } from "../contexts/PropsContext"

interface ProjectPageViewProps {
  children: ReactNode
}

const ProjectPageView = ({ children }: ProjectPageViewProps) => {
  const { advancedMode } = useProps()

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HeaderFunct />
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 1 }}>
          <SideBar />
        </div>
        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          {advancedMode ? <QueryTextboxAdvanced /> : <QueryTextbox />}
          <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPageView
