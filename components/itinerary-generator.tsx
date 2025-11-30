"use client"

import { useState } from "react"
import { TrekSelector } from "./trek-selector"
import { ItineraryDisplay } from "./itinerary-display"
import { MincharAgentic } from "./mincha-agentic"
import type { Trek, Itinerary } from "@/lib/types"

export function ItineraryGenerator() {
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userPreferences, setUserPreferences] = useState({
    budget: "moderate",
    fitnessLevel: "moderate",
    interests: ["culture", "nature"],
    travelStyle: "immersive",
  })

  const handleGenerateItinerary = async (trek: Trek) => {
    setSelectedTrek(trek)
    setItinerary(null)
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trek, userPreferences }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate itinerary (${response.status})`)
      }

      const data = await response.json()
      setItinerary(data)
      setError(null)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error("[v0] Itinerary generation error:", errorMsg)
      setError("Failed to generate itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-light/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Mincha Agentic Agent */}
              <MincharAgentic
                selectedTrek={selectedTrek}
                hasItinerary={!!itinerary}
                loading={loading}
                error={!!error}
              />

              {/* Preferences Panel */}
              <div className="glass p-6 rounded-xl border border-primary/10 shadow-lg">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Your Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground/60 block mb-2 font-semibold uppercase">Budget</label>
                    <select
                      value={userPreferences.budget}
                      onChange={(e) =>
                        setUserPreferences({
                          ...userPreferences,
                          budget: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 text-sm border border-primary/20 rounded-lg bg-background hover:border-primary/40 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                    >
                      <option value="budget">Budget-Friendly</option>
                      <option value="moderate">Moderate</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-foreground/60 block mb-2 font-semibold uppercase">
                      Fitness Level
                    </label>
                    <select
                      value={userPreferences.fitnessLevel}
                      onChange={(e) =>
                        setUserPreferences({
                          ...userPreferences,
                          fitnessLevel: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 text-sm border border-primary/20 rounded-lg bg-background hover:border-primary/40 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="moderate">Moderate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-foreground/60 block mb-2 font-semibold uppercase">
                      Travel Style
                    </label>
                    <select
                      value={userPreferences.travelStyle}
                      onChange={(e) =>
                        setUserPreferences({
                          ...userPreferences,
                          travelStyle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 text-sm border border-primary/20 rounded-lg bg-background hover:border-primary/40 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                    >
                      <option value="immersive">Immersive & Deep</option>
                      <option value="balanced">Balanced</option>
                      <option value="relaxed">Relaxed & Casual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trek Selector */}
              <TrekSelector onSelect={handleGenerateItinerary} loading={loading} />
            </div>
          </div>

          <div className="lg:col-span-2">
            {error && (
              <div className="glass p-6 rounded-xl border border-red-200/30 bg-red-50/50 dark:bg-red-950/20">
                <p className="text-red-700 dark:text-red-200 text-sm font-semibold">Error generating itinerary</p>
                <p className="text-red-600 dark:text-red-300 text-xs mt-2">{error}</p>
              </div>
            )}
            {itinerary && selectedTrek ? (
              <ItineraryDisplay itinerary={itinerary} trek={selectedTrek} loading={loading} />
            ) : (
              <div className="glass p-16 text-center rounded-xl border border-primary/10 shadow-lg">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 opacity-20"></div>
                  <p className="text-foreground/60 text-lg leading-relaxed font-light">
                    {loading
                      ? "Preparing your personalized cultural adventure..."
                      : "Select a trek to begin your Nepal cultural journey"}
                  </p>
                </div>
                {loading && (
                  <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
                    <div
                      className="w-3 h-3 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-3 h-3 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
