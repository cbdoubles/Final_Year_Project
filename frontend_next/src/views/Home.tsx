// pages/index.tsx
import React from "react"
import Button from "@/src/utils/Button"
import Nav from "@/src/components/nav/nav"

export default function Home() {
  return (
    // <div className="centered-column">
    <div className="h-[100vh] flex flex-col">
      <Nav title="" />
      <div className="flex w-full flex-grow items-center justify-center">
        <div className="grid gap-10 items-center justify-center bg-blue-300/80 rounded-xl p-20">
          <Button title={"Existing Project"} color={"#0077C8"} size={"20px"} />
          <Button title={"New Project"} color={"#0077C8"} size={"20px"} />
        </div>
      </div>
    </div>
  )
}
