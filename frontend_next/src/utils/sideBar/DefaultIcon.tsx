import React, { useState } from "react"
import QueryIcon from "@/utils/sideBar/QueryIcon"
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline"

const items = [
  {
    employee: "Szymon",
    favorites: ["def1", "def2", "def3", "def4"]
  },
  { employee: "Geri", favorites: ["def1", "def2"] },
  { employee: "Caolán", favorites: ["def1"] }
]

export default function DefaultIcon({ collapsed }: { collapsed: boolean }) {
  const loadItems = async () => {
    await new Promise((r) => setTimeout(r, 2000))
    return items
  }
  return (
    <QueryIcon
      loadItems={loadItems}
      type="Default"
      icon={GlobeAsiaAustraliaIcon}
      collapsed={collapsed}
    />
  )
}
