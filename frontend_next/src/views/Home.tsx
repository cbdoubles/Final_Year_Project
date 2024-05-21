// pages/index.tsx
import React, { useState, useEffect } from "react"
import Button from "@/src/utils/Button"
import Nav from "@/src/components/nav/Nav"
import SelectExistingProject from "@/src/components/select/SelectExistingProject"

export default function Home() {
  const [showComponent, setShowComponent] = useState(false)
  const handleButtonClick = () => {
    setShowComponent(true)
    console.log(showComponent)
  }
  useEffect(() => {
    console.log(showComponent)
  }, [showComponent])

  return (
    // <div className="centered-column">
    <div className="h-[100vh] flex flex-col">
      <Nav title="" />
      <div className="flex w-full flex-grow items-center justify-center">
        <div className="grid gap-10 items-center justify-center bg-blue-300/80 rounded-xl p-20">
          <Button
            title={"Existing Project"}
            color={"#0077C8"}
            size={"20px"}
            onClick={handleButtonClick}
          />
          <Button title={"New Project"} color={"#0077C8"} size={"20px"} />
        </div>
      </div>
      {showComponent && <SelectExistingProject />}
    </div>
  )
}
