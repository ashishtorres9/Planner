"use client"

import { useState } from "react"
import { BookingCard } from "./booking-card"
import { CulturalAvatar } from "./cultural-avatar"
import type { Trek, Itinerary } from "@/lib/types"
import { ChevronDown } from "lucide-react"

interface ItineraryDisplayProps {
  itinerary: Itinerary
  trek: Trek
  loading: boolean
}

export function ItineraryDisplay({ itinerary, trek, loading }: ItineraryDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-2xl p-12 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
          <p className="text-muted-foreground font-medium">Crafting your personalized itinerary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-2xl p-8 space-y-4">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <CulturalAvatar culture={trek.culture} size="lg" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{trek.name}</h2>
            <p className="text-secondary font-medium mb-4">
              {trek.culture.charAt(0).toUpperCase() + trek.culture.slice(1)} • {trek.region}
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Duration</span>
                <p className="font-semibold text-lg text-foreground mt-1">3 Days</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Difficulty</span>
                <p className="font-semibold text-lg text-foreground mt-1">{trek.difficulty}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Best Season</span>
                <p className="font-semibold text-lg text-foreground mt-1">{trek.bestSeason}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {itinerary.days.map((day, index) => (
          <div
            key={index}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 border-2 border-transparent"
            onClick={() => setExpandedDay(expandedDay === index ? null : index)}
          >
            <div className="p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-lg shadow-md">
                    {day.day}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-semibold text-foreground">{day.highlight}</h3>
                  </div>
                </div>
                <div className={`transition-transform duration-300 ${expandedDay === index ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed">{day.description}</p>

              {expandedDay === index && (
                <div className="space-y-6 mt-6 pt-6 border-t border-border/50 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-lg">📋</span> Activities
                    </h4>
                    <ul className="text-sm text-foreground/80 space-y-3">
                      {day.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary font-bold mt-0.5 flex-shrink-0">✓</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-lg">🏨</span> Accommodation & Services
                    </h4>
                    <div className="grid gap-3">
                      {day.services && day.services.length > 0 ? (
                        day.services.map((service) => <BookingCard key={service.id} service={service} />)
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No services assigned for this day</p>
                      )}
                    </div>
                  </div>

                  {/* Altitude & Distance */}
                  <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/10 p-5 rounded-xl border border-secondary/20">
                    <div>
                      <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wide">Altitude</p>
                      <p className="text-foreground font-semibold text-lg mt-2">{day.altitude}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wide">
                        Walking Distance
                      </p>
                      <p className="text-foreground font-semibold text-lg mt-2">{day.distance}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-2xl p-8 space-y-4 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 border-2 border-primary/20">
        <h3 className="font-semibold text-foreground text-xl">Trip Summary</h3>
        <p className="text-foreground/80 leading-relaxed text-sm">{itinerary.summary}</p>
        <div className="bg-secondary/20 border-l-4 border-secondary p-5 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Cultural Insight</p>
          <p className="text-sm text-foreground">{itinerary.culturalTip}</p>
        </div>
      </div>
    </div>
  )
}
