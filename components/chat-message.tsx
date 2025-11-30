"use client"

import type { ChatMessage as ChatMessageType, Trek } from "@/lib/types"
import { ItineraryDisplay } from "./itinerary-display"
import { Button } from "@/components/ui/button"

interface ChatMessageProps {
  message: ChatMessageType
  onSelectTrek: (trek: Trek) => void
}

export function ChatMessage({ message, onSelectTrek }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl px-5 py-3 rounded-2xl ${
          message.role === "user"
            ? "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-md rounded-br-none"
            : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-bl-none"
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {message.suggestedTreks && message.suggestedTreks.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-xs font-semibold opacity-75 uppercase tracking-wide">Suggested Treks</p>
            <div className="grid gap-2">
              {message.suggestedTreks.map((trek) => (
                <Button
                  key={trek.id}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left hover:bg-secondary/10 bg-white/50 dark:bg-slate-800/50 border border-primary/20 hover:border-primary/50 transition-all duration-300 rounded-lg"
                  onClick={() => onSelectTrek(trek)}
                >
                  <div className="space-y-1 w-full">
                    <div className="font-semibold text-sm text-foreground">{trek.name}</div>
                    <div className="text-xs opacity-70">
                      {trek.culture} • {trek.difficulty}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {message.generatedItinerary && (
          <div className="mt-5 pt-5 border-t border-border/50">
            <ItineraryDisplay itinerary={message.generatedItinerary} />
          </div>
        )}
      </div>
    </div>
  )
}
