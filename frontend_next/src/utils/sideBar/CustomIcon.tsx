import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"
import QueryIcon from "@/utils/sideBar/QueryIcon"

const items = [
  {
    employee: "Szymon",
    favorites: ["cust1", "cust1", "cust1", "cust2"]
  },
  { employee: "Geri", favorites: ["def1", "cust2"] },
  { employee: "Caolán", favorites: ["cust1"] }
]

export default function Custom() {
  return (
    <QueryIcon items={items} type="Custom" icon={ClipboardDocumentCheckIcon} />
  )
}
