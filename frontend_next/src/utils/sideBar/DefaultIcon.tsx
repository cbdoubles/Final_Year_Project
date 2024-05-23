import React, { useState } from "react"
import QueryIcon from "@/utils/sideBar/QueryIcon"
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline"

// //Detail for icon
// const properties = {
//   name: "Default",
//   icon: GlobeAsiaAustraliaIcon
// }

const items = [
  {
    employee: "Szymon",
    favorites: ["def1", "def2", "def3", "def4"]
  },
  { employee: "Geri", favorites: ["def1", "def2"] },
  { employee: "Caolán", favorites: ["def1"] }
]

export default function Default() {
  return (
    <QueryIcon items={items} type="Default" icon={GlobeAsiaAustraliaIcon} />
  )
}
