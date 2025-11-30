"use client"

import { useState } from "react"
import { Heart, Share2, Download, MapPin, Calendar, Users } from "lucide-react"

interface SavedItinerary {
  id: string
  name: string
  trek: string
  culture: string
  dates: string
  travelers: number
  savedAt: Date
  bookmarks: number
}

const EXAMPLE_ITINERARIES: SavedItinerary[] = [
  {
    id: "1",
    name: "My First Nepal Adventure",
    trek: "Bodhi Trail - Dhulikhel to Namobuddha",
    culture: "Buddhist",
    dates: "March 15-17, 2024",
    travelers: 2,
    savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    bookmarks: 3,
  },
  {
    id: "2",
    name: "Gurung Heritage Experience",
    trek: "Manaslu Foothills - Gurung Heartland Trek",
    culture: "Gurung",
    dates: "April 20-22, 2024",
    travelers: 4,
    savedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    bookmarks: 5,
  },
]

export function SavedItineraries() {
  const [itineraries] = useState<SavedItinerary[]>(EXAMPLE_ITINERARIES)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">Your Saved Itineraries</h3>
        <p className="text-muted-foreground">View and manage your planned Nepal treks</p>
      </div>

      {itineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              onClick={() => setSelectedId(selectedId === itinerary.id ? null : itinerary.id)}
              className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                selectedId === itinerary.id
                  ? "border-primary/50 shadow-lg"
                  : "border-white/20 dark:border-white/10 hover:border-primary/30"
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-lg">{itinerary.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{itinerary.trek}</p>
                  </div>
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {itinerary.culture}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {itinerary.dates}
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    {itinerary.travelers} travelers
                  </div>
                </div>

                {/* Expanded Actions */}
                {selectedId === itinerary.id && (
                  <div className="border-t border-white/20 pt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs text-muted-foreground">
                      Saved {Math.floor((Date.now() - itinerary.savedAt.getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        Export
                      </button>
                      <button className="flex-1 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No saved itineraries yet</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Start planning your Nepal adventure to save itineraries
          </p>
        </div>
      )}
    </div>
  )
}
