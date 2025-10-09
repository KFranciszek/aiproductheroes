"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="gap-1"
    >
      <Star
        className={`h-4 w-4 transition-colors ${
          isFavorite ? "fill-yellow-500 text-yellow-500" : isHovered ? "text-yellow-500" : "text-muted-foreground"
        }`}
      />
      {isFavorite ? "Ulubione" : "Dodaj do ulubionych"}
    </Button>
  )
}
