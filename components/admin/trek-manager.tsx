"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Trek } from "@/lib/types"

export function TrekManager() {
  const [treks, setTreks] = useState<Trek[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Trek>>({})

  useEffect(() => {
    loadTreks()
  }, [])

  const loadTreks = async () => {
    try {
      const response = await fetch("/api/treks")
      const data = await response.json()
      setTreks(data)
    } catch (error) {
      console.error("[v0] Error loading treks:", error)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.culture) {
      alert("Please fill in all required fields")
      return
    }

    try {
      // In production, this would save to the database
      // For now, we'll just update local state
      if (editingId) {
        setTreks(treks.map((t) => (t.id === editingId ? ({ ...formData, id: editingId } as Trek) : t)))
      } else {
        const newTrek: Trek = {
          id: `trek-${Date.now()}`,
          name: formData.name || "",
          culture: formData.culture || "",
          region: formData.region || "",
          difficulty: formData.difficulty || "Moderate",
          bestSeason: formData.bestSeason || "",
          description: formData.description || "",
          highlights: formData.highlights || [],
        }
        setTreks([...treks, newTrek])
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({})
      alert("Trek saved successfully. Update your data/treks.json file to persist changes.")
    } catch (error) {
      console.error("[v0] Error saving trek:", error)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this trek?")) {
      setTreks(treks.filter((t) => t.id !== id))
    }
  }

  const handleEdit = (trek: Trek) => {
    setFormData(trek)
    setEditingId(trek.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Trek Library</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setFormData({})
            setEditingId(null)
          }}
        >
          Add New Trek
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-2 border-primary">
          <h3 className="text-lg font-semibold text-primary mb-4">{editingId ? "Edit Trek" : "Create New Trek"}</h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Trek Name *</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Culture *</label>
                <select
                  value={formData.culture || ""}
                  onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                >
                  <option value="">Select Culture</option>
                  <option value="sherpa">Sherpa</option>
                  <option value="newari">Newari</option>
                  <option value="sunuwar">Sunuwar</option>
                  <option value="tamang">Tamang</option>
                  <option value="gurung">Gurung</option>
                  <option value="limbu">Limbu</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Region</label>
                <input
                  type="text"
                  value={formData.region || ""}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Difficulty</label>
                <select
                  value={formData.difficulty || "Moderate"}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-1">Best Season</label>
              <input
                type="text"
                placeholder="e.g., September-November"
                value={formData.bestSeason || ""}
                onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-1">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Trek</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setFormData({})
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Trek List */}
      <div className="grid gap-4">
        {treks.map((trek) => (
          <Card key={trek.id} className="p-4 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{trek.name}</h3>
                <p className="text-sm text-accent">
                  {trek.culture} • {trek.region}
                </p>
              </div>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                {trek.difficulty}
              </span>
            </div>
            <p className="text-sm text-foreground mb-3">{trek.description}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(trek)}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(trek.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-accent-light/5 border-accent">
        <p className="text-sm text-foreground">
          <strong>To persist changes:</strong> Export the updated data and commit it to your{" "}
          <code className="bg-white/50 px-1 rounded">data/treks.json</code> file in your repository, then redeploy.
        </p>
      </Card>
    </div>
  )
}
