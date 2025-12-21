// components/chat-message.tsx
"use client";

import type { ChatMessage as ChatMessageType, Trek } from "@/lib/types";
import { ItineraryDisplay } from "./itinerary-display";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectTrek: (trek: Trek) => void;
  decodeCulture: (code: string) => string;
  decodeDifficulty: (code: string) => string;
  decodeAccessibility: (code: string) => string;
  decodeSpiritual: (code: string) => string;
}

export function ChatMessage({
  message,
  onSelectTrek,
  decodeCulture,
  decodeDifficulty,
  decodeAccessibility,
  decodeSpiritual,
}: ChatMessageProps) {
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
          <div className="mt-5 space-y-4">
            <p className="text-xs font-semibold opacity-75 uppercase tracking-wide">Suggested Treks</p>
            <div className="grid gap-3">
              {message.suggestedTreks.map((trek) => {
                const cultureName = trek.culture_group 
                  ? decodeCulture(trek.culture_group) 
                  : trek.culture;
                const difficultyName = decodeDifficulty(trek.difficulty);
                const accessibilityName = trek.accessibility 
                  ? decodeAccessibility(trek.accessibility) 
                  : "";
                const spiritualName = trek.spiritual_significance 
                  ? decodeSpiritual(trek.spiritual_significance) 
                  : "";

                return (
                  <div
                    key={trek.id}
                    className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">{trek.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {cultureName}
                          </span>
                          <span className="text-xs text-muted-foreground">• {difficultyName}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        ₨ {trek.min_npr.toLocaleString()}–{trek.max_npr.toLocaleString()}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {spiritualName && (
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          {spiritualName}
                        </span>
                      )}
                      {accessibilityName && (
                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          {accessibilityName}
                        </span>
                      )}
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {trek.duration_days} Days
                      </span>
                    </div>

                    {/* Itinerary Preview */}
                    {trek.itineraryPreview && (
                      <div className="mt-3 space-y-2">
                        {trek.itineraryPreview.slice(0, 2).map((day, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground flex gap-2">
                            <span className="font-bold">Day {day.day}:</span>
                            <span>{day.title}</span>
                            {day.meals && <span className="text-green-600">({day.meals})</span>}
                            {day.accommodation && <span className="text-orange-600">• {day.accommodation}</span>}
                            {day.transport && <span className="text-blue-600">• {day.transport}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mt-3 h-auto py-2 text-xs font-medium bg-white/40 hover:bg-primary/10 border-primary/30 hover:border-primary/50"
                      onClick={() => onSelectTrek(trek)}
                    >
                      View Full Itinerary & WhatsApp
                    </Button>
                  </div>
                );
              })}
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
  );
}