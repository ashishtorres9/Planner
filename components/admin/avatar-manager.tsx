"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { avatars } from "@/lib/avatars"

export function AvatarManager() {
  const [avatarList, setAvatarList] = useState(avatars)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [formData, setFormData] = useState({ emoji: "", name: "", description: "" })

  const handleEdit = (key: string) => {
    const avatar = avatarList[key as keyof typeof avatarList]
    setFormData({
      emoji: avatar.emoji,
      name: avatar.name,
      description: avatar.description,
    })
    setEditingKey(key)
  }

  const handleSave = () => {
    if (!editingKey || !formData.emoji || !formData.name) {
      alert("Please fill in all fields")
      return
    }

    setAvatarList({
      ...avatarList,
      [editingKey]: formData,
    })
    setEditingKey(null)
    alert("Avatar updated. Update your lib/avatars.ts file to persist changes.")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Cultural Avatars</h2>

      {editingKey && (
        <Card className="p-6 border-2 border-primary">
          <h3 className="text-lg font-semibold text-primary mb-4">Edit Avatar: {editingKey}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-accent mb-1">Emoji</label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                placeholder="e.g., 🏔️"
                className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground text-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Avatar</Button>
              <Button variant="outline" onClick={() => setEditingKey(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Avatar Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(avatarList).map(([key, avatar]) => (
          <Card key={key} className="p-6 text-center hover:shadow-lg transition">
            <div className="text-5xl mb-3">{avatar.emoji}</div>
            <h3 className="font-semibold text-foreground mb-1">{avatar.name}</h3>
            <p className="text-sm text-accent mb-4">{key}</p>
            <p className="text-xs text-muted mb-4">{avatar.description}</p>
            <Button size="sm" variant="outline" onClick={() => handleEdit(key)}>
              Edit
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-accent-light/5 border-accent">
        <p className="text-sm text-foreground">
          <strong>Culture Mapping:</strong> Avatars are matched to trek cultures. When a user selects a trek, the
          corresponding avatar appears automatically.
        </p>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">How to Add More Avatars</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>
            Add new culture entries in <code className="bg-white px-1">lib/avatars.ts</code>
          </li>
          <li>
            Update <code className="bg-white px-1">data/treks.json</code> to use the new culture names
          </li>
          <li>
            Add corresponding services to <code className="bg-white px-1">data/services.json</code>
          </li>
          <li>Redeploy your app</li>
        </ol>
      </Card>
    </div>
  )
}
