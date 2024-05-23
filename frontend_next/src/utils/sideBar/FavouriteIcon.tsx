import React, { useState } from "react"
import { StarIcon } from "@heroicons/react/24/outline"
import QueryIcon from "./QueryIcon"

const items = [
  {
    employee: "Szymon",
    favorites: ["favourite1", "favourite2", "favourite3", "favourite4"]
  },
  { employee: "Geri", favorites: ["favourite1", "favourite2"] },
  { employee: "Caolán", favorites: ["favourite1"] }
]

export default function FavoriteIcon() {
  return <QueryIcon items={items} type="Favorite" icon={StarIcon} />
}
