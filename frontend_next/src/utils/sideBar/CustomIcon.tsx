import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"
import QueryIcon from "@/utils/sideBar/QueryIcon"

const items = [
  {
    employee: "Szymon",
    favorites: ["cust1", "cust1", "cust1", "cust2"]
  },
  { employee: "Geri", favorites: ["cust1", "cust2"] },
  { employee: "Caolán", favorites: ["cust1"] }
]

export default function CustomIcon({ collapsed }: { collapsed: boolean }) {
  const loadItems = async () => {
    await new Promise((r) => setTimeout(r, 2000))
    return items
  }
  return (
    <QueryIcon
      loadItems={loadItems}
      collapsed={collapsed}
      type="Custom"
      icon={ClipboardDocumentCheckIcon}
    />
  )
}
