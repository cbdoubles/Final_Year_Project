// pages/index.tsx
import React, { useState } from "react"
import Nav from "@/src/components/nav/Nav"
import SelectExistingProject from "@/src/components/home/SelectExistingProject"
import SelectExistingProjectButton from "@/src/utils/SelectExistingProjectButton"
import CreateNewProjectButton from "@/src/utils/StartNewProjectButton"
import StartNewProject from "@/src/components/home/StartNewProject"

export default function Home() {
  const [showSelectExistingProject, setShowSelectExistingProject] =
    useState(false)
  const [showStartNewProject, setShowStartNewProject] = useState(false)

  const handleSelectExistingProjectButtonClick = () => {
    setShowSelectExistingProject(true)
  }

  const handleStartNewProjectButtonClick = () => {
    setShowStartNewProject(true)
  }

  return (
    <div className="h-[100vh] flex flex-col">
      <Nav title="" />
      <div className="flex w-full flex-grow items-center justify-center">
        <div className="grid gap-10 items-center justify-center bg-blue-300/80 rounded-xl p-20">
          <SelectExistingProjectButton
            onClick={handleSelectExistingProjectButtonClick}
          />
          <CreateNewProjectButton onClick={handleStartNewProjectButtonClick} />
        </div>
      </div>
      {showSelectExistingProject && (
        <SelectExistingProject
          onClose={() => setShowSelectExistingProject(false)}
        />
      )}
      {showStartNewProject && (
        <StartNewProject
          isVisable={showStartNewProject}
          onClose={() => setShowStartNewProject(false)}
        />
      )}
    </div>
  )
}
