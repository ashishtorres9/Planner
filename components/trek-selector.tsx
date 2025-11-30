"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Trek } from "@/lib/types"

interface TrekSelectorProps {
  onSelect: (trek: Trek) => void
  loading: boolean
}

export function TrekSelector({ onSelect, loading }: TrekSelectorProps) {
  const [treks, setTreks] = useState<Trek[]>([])
  const [filteredTreks, setFilteredTreks] = useState<Trek[]>([])
  const [selectedCulture, setSelectedCulture] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")

  useEffect(() => {
    const loadTreks = async () => {
      try {
        const response = await fetch("/api/treks")
        if (!response.ok) throw new Error("Failed to load treks")
        const data = await response.json()
        setTreks(data)
        setFilteredTreks(data)
      } catch (error) {
        console.error("[v0] Error loading treks:", error)
      }
    }

    loadTreks()
  }, [])

  const applyFilters = (culture: string, difficulty: string) => {
    setSelectedCulture(culture)
    setSelectedDifficulty(difficulty)

    let filtered = treks

    if (culture) {
      filtered = filtered.filter((trek) => trek.culture === culture)
    }

    if (difficulty) {
      filtered = filtered.filter((trek) => trek.difficulty === difficulty)
    }

    setFilteredTreks(filtered)
  }

  const cultures = Array.from(new Set(treks.map((t) => t.culture)))
  const difficulties = Array.from(new Set(treks.map((t) => t.difficulty)))

  return (
    <div className="glass p-4 rounded-lg border border-accent/20 space-y-4">
      <h3 className="font-semibold text-foreground">Find Your Trek</h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted uppercase block mb-2">Culture</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCulture === "" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => applyFilters("", selectedDifficulty)}
            >
              All
            </Button>
            {cultures.map((culture) => (
              <Button
                key={culture}
                variant={selectedCulture === culture ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => applyFilters(culture, selectedDifficulty)}
              >
                {culture.charAt(0).toUpperCase() + culture.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted uppercase block mb-2">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDifficulty === "" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => applyFilters(selectedCulture, "")}
            >
              All
            </Button>
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => applyFilters(selectedCulture, difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {filteredTreks.length > 0 ? (
          filteredTreks.map((trek) => (
            <Card
              key={trek.id}
              className={`p-4 cursor-pointer transition border-2 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:border-primary"
              } border-transparent rounded-lg`}
              onClick={() => !loading && onSelect(trek)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{trek.name}</h3>
                  <p className="text-xs text-accent mt-1">
                    {trek.culture.charAt(0).toUpperCase() + trek.culture.slice(1)}
                  </p>
                  <p className="text-xs text-muted mt-2">{trek.region}</p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                    {trek.difficulty}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted py-4 text-sm">No treks match your filters</p>
        )}
      </div>
    </div>
  )
}
