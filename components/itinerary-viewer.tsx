"use client"

import { useState } from "react"
import type { Itinerary, DayItinerary } from "@/lib/types"
import { ChevronDown, MapPin, Utensils, Home, AlertCircle } from "lucide-react"

interface ItineraryViewerProps {
  itinerary: Itinerary
  trekName: string
  trekCulture: string
}

export function ItineraryViewer({ itinerary, trekName, trekCulture }: ItineraryViewerProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [showCulturalTip, setShowCulturalTip] = useState(true)

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const getCultureColor = (culture: string) => {
    const colors: Record<string, string> = {
      buddhist: "from-amber-500 to-orange-500",
      gurung: "from-emerald-500 to-teal-500",
      limbu: "from-green-500 to-emerald-600",
      newari: "from-red-500 to-rose-600",
      tamang: "from-blue-500 to-cyan-500",
      hindu: "from-purple-500 to-pink-500",
      tibetan: "from-orange-500 to-yellow-600",
    }
    return colors[culture.toLowerCase()] || "from-primary to-secondary"
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getCultureColor(trekCulture)} rounded-2xl p-8 text-white shadow-lg`}>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">{trekName}</h2>
          <p className="text-white/90 text-lg capitalize">
            Discover the {trekCulture} culture heritage through this 3-day immersive journey
          </p>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <MapPin className="w-4 h-4" />
            <span>3 Days • Carefully curated experiences</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-2">Trip Overview</h3>
        <p className="text-muted-foreground leading-relaxed">{itinerary.summary}</p>
      </div>

      {/* Cultural Tip */}
      {showCulturalTip && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-5 flex gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Cultural Insight</h4>
            <p className="text-sm text-foreground/80">{itinerary.culturalTip}</p>
          </div>
          <button
            onClick={() => setShowCulturalTip(false)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
      )}

      {/* Day-by-Day Itinerary */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Day-by-Day Breakdown</h3>
        {itinerary.days.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            isExpanded={expandedDays.includes(day.day)}
            onToggle={toggleDay}
            cultureColor={getCultureColor(trekCulture)}
          />
        ))}
      </div>

      {/* Booking CTA */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to Book Your Adventure?</h3>
        <p className="text-white/90">Our team will help you arrange accommodations, guides, and all bookings</p>
        <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
          Book This Itinerary
        </button>
      </div>
    </div>
  )
}

function DayCard({
  day,
  isExpanded,
  onToggle,
  cultureColor,
}: {
  day: DayItinerary
  isExpanded: boolean
  onToggle: (day: number) => void
  cultureColor: string
}) {
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
      <button
        onClick={() => onToggle(day.day)}
        className="w-full p-5 bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 flex-1 text-left">
          <div
            className={`bg-gradient-to-br ${cultureColor} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
          >
            {day.day}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground text-sm md:text-base">{day.highlight}</h4>
            <p className="text-xs text-muted-foreground truncate mt-1">{day.description.substring(0, 80)}...</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-border/50 p-5 bg-white/20 dark:bg-slate-900/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <h5 className="font-semibold text-foreground mb-2">About This Day</h5>
            <p className="text-sm text-foreground/80 leading-relaxed">{day.description}</p>
          </div>

          {/* Activities */}
          {day.activities && day.activities.length > 0 && (
            <div>
              <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Activities
              </h5>
              <ul className="space-y-2">
                {day.activities.map((activity, idx) => (
                  <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meals Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Utensils className="w-4 h-4 text-primary" />
                Meals Included
              </div>
              <p className="text-xs text-foreground/70">Breakfast, lunch, and dinner with local cuisine</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Home className="w-4 h-4 text-primary" />
                Accommodation
              </div>
              <p className="text-xs text-foreground/70">Homestay or eco-lodge</p>
            </div>
          </div>

          {/* Booking Options */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-3">Book services for this day</p>
            <div className="flex gap-2 flex-wrap">
              <button className="text-xs bg-white dark:bg-slate-900 text-primary px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">
                View Guides
              </button>
              <button className="text-xs bg-white dark:bg-slate-900 text-primary px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">
                View Hotels
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
