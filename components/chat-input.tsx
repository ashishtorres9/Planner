"use client"

import type React from "react"
import { useState } from "react"
import type { Trek } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled: boolean
  selectedTrek: Trek | null
}

export function ChatInput({ onSend, disabled, selectedTrek }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input)
      setInput("")
    }
  }

  const quickPrompts = ["Budget Sunuwar trek", "High altitude adventure", "Cultural homestay", "Beginner-friendly"]

  return (
    <div className="space-y-3">
      {!selectedTrek && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-muted-foreground font-medium">Try:</span>
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="text-xs bg-white/50 dark:bg-slate-800/50 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-lg font-medium"
              onClick={() => {
                onSend(prompt)
              }}
              disabled={disabled}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedTrek ? `Ask about ${selectedTrek.name}...` : "Describe your ideal Nepal adventure..."}
          disabled={disabled}
          className="flex-1 px-5 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 transition-all duration-300 text-sm"
        />
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          size="icon"
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium transition-all duration-300 rounded-xl shadow-md hover:shadow-lg h-11 w-11"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  )
}
