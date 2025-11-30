"use client"

import { avatars } from "@/lib/avatars"

interface CulturalAvatarProps {
  culture: string
  size?: "sm" | "md" | "lg"
}

export function CulturalAvatar({ culture, size = "md" }: CulturalAvatarProps) {
  const avatar = avatars[culture.toLowerCase() as keyof typeof avatars] || avatars.default

  const sizeClasses = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl",
  }

  return <div className={`${sizeClasses[size]} leading-none`}>{avatar.emoji}</div>
}
