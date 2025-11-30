"use client"

import { useState, useEffect } from "react"
import { CulturalAvatar } from "./cultural-avatar"
import type { Trek } from "@/lib/types"

interface MincharAgenticProps {
  selectedTrek: Trek | null
  hasItinerary: boolean
  loading: boolean
  error: boolean
}

const agenticMessages = {
  initial:
    "Namaste! I'm Mincha, your cultural guide. Which Nepal trek speaks to your soul? I'll craft a personalized experience.",
  loading: "Weaving together authentic experiences, local wisdom, and perfect timing for your journey...",
  error: "Let me help you find another adventure. Pick another trek to explore.",
  ready: {
    sunuwar:
      "The Sunuwar people celebrate Sakela with vibrant festivals and ancient tea traditions. Your itinerary honors their warmth.",
    sherpa:
      "The legendary Sherpa master the mountains with deep spiritual practices. Expect sacred monasteries and Himalayan vistas.",
    newari:
      "The Newari are master craftspeople with intricate architecture. Your journey showcases centuries-old artistry.",
    tamang:
      "The Tamang have a rich musical heritage and warm hospitality. Experience authentic village life and mountain beauty.",
    magar: "The Magar offer genuine cultural immersion with traditional mountain wisdom passed through generations.",
  },
  selected: (trek: Trek) =>
    `Perfect choice! ${trek.name} awaits. Crafting your personalized itinerary with local wisdom...`,
}

export function MincharAgentic({ selectedTrek, hasItinerary, loading, error }: MincharAgenticProps) {
  const [message, setMessage] = useState(agenticMessages.initial)

  useEffect(() => {
    if (error) {
      setMessage(agenticMessages.error)
    } else if (loading) {
      setMessage(agenticMessages.loading)
    } else if (hasItinerary && selectedTrek) {
      const cultureKey = selectedTrek.culture.toLowerCase() as keyof typeof agenticMessages.ready
      const culturalMsg = agenticMessages.ready[cultureKey] || agenticMessages.ready.magar
      setMessage(culturalMsg)
    } else if (selectedTrek) {
      setMessage(agenticMessages.selected(selectedTrek))
    } else {
      setMessage(agenticMessages.initial)
    }
  }, [selectedTrek, hasItinerary, loading, error])

  return (
    <div className="glass p-6 rounded-xl border border-primary/20 shadow-lg hover:shadow-xl transition-smooth">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <CulturalAvatar culture={selectedTrek?.culture || "guide"} size="lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground mb-2 text-lg">Mincha</h3>
          <p className={`text-sm leading-relaxed italic font-light ${error ? "text-red-600" : "text-foreground/70"}`}>
            "{message}"
          </p>
          {loading && (
            <div className="flex gap-1 mt-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"></div>
              <div
                className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
