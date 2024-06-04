import React, { useState } from "react"
import { StarIcon } from "@heroicons/react/24/outline"
import QueryIcon from "./QueryIcon"

const items = [
  {
    employee: "Szymon",
    favorites: ["favorite1", "favorite2", "favorite3", "favorite4"]
  },
  { employee: "Geri", favorites: ["favorite1", "favorite2"] },
  { employee: "Caolán", favorites: ["favourite1"] }
]

export default function FavoriteIcon({ collapsed }: { collapsed: boolean }) {
  const loadItems = async () => {
    await new Promise((r) => setTimeout(r, 2000))
    return items
  }

  return (
    <QueryIcon
      loadItems={loadItems}
      type="Favorite"
      icon={StarIcon}
      collapsed={collapsed}
    />
  )
}
