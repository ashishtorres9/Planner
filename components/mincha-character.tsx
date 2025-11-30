"use client"

interface MincharacterProps {
  message: string
  avatar?: string
}

export function Mincha({ message, avatar = "mincha" }: MincharacterProps) {
  const avatarEmoji = avatar === "mincha" ? "👩‍🦰" : "👩‍🌾"

  return (
    <div className="glass p-6 space-y-3">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{avatarEmoji}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary mb-2">Mincha's Recommendation</h3>
          <p className="text-sm text-foreground leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  )
}
