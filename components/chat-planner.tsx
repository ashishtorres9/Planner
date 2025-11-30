"use client"

import { useState, useRef, useEffect } from "react"
import type { ChatMessage as ChatMessageType, Trek } from "@/lib/types"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { MinchaChatAvatar } from "./mincha-chat-avatar"

const QUICK_START_PRESETS = [
  {
    label: "Quick Cultural Immersion",
    message:
      "I want to experience authentic Nepal culture for 3 days with moderate budget and easy to moderate trekking. Which trek do you recommend?",
  },
  {
    label: "Budget-Friendly Adventure",
    message: "I'm looking for an affordable 3-day trek under $100 with good cultural experience and easy difficulty.",
  },
  {
    label: "Spiritual Journey",
    message:
      "I'm interested in Buddhist and Hindu spiritual sites. What's the best 3-day trek for meditation and temple visits?",
  },
  {
    label: "Tea Garden & Mountain Views",
    message:
      "I'd love to explore tea gardens, interact with local communities, and see mountain panoramas. Which trek?",
  },
]

export function ChatPlanner() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Namaste! I'm Mincha, your curious travel guide. I'll help you find the perfect 3-day trek through Nepal's most authentic cultural regions. Tell me about yourself or choose one of my quick-start options below.",
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null)
  const [showPresets, setShowPresets] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (userMessage: string) => {
    setShowPresets(false)
    // Add user message
    const newUserMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          selectedTrek,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: ChatMessageType = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        suggestedTreks: data.suggestedTreks,
        generatedItinerary: data.generatedItinerary,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Auto-select trek if AI suggested one
      if (data.suggestedTreks?.length === 1) {
        setSelectedTrek(data.suggestedTreks[0])
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: ChatMessageType = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "Sorry, I encountered an issue. Please try again with a simpler message.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTrek = (trek: Trek) => {
    setSelectedTrek(trek)
    const userMsg = `Let's explore the ${trek.name} trek focusing on ${trek.culture} culture. Can you create a detailed 3-day itinerary?`
    handleSendMessage(userMsg)
  }

  const handleSelectPreset = (preset: (typeof QUICK_START_PRESETS)[0]) => {
    handleSendMessage(preset.message)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="border-b border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Heritage Hub Nepal</h1>
              <p className="text-xs text-muted-foreground">Chat with Mincha to plan your adventure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {messages.map((message, idx) => (
            <div key={message.id} style={{ animationDelay: `${idx * 50}ms` }}>
              {message.role === "assistant" && <MinchaChatAvatar />}
              <ChatMessage message={message} onSelectTrek={handleSelectTrek} />
            </div>
          ))}

          {showPresets && messages.length === 1 && (
            <div className="mt-8 space-y-3">
              <p className="text-sm text-muted-foreground font-medium px-2">Or choose one of these popular options:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUICK_START_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className="text-left p-4 rounded-xl border border-border/50 bg-white/40 dark:bg-slate-900/40 hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <p className="font-medium text-foreground text-sm">{preset.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-primary">
              <MinchaChatAvatar />
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-2xl px-4 py-3 rounded-bl-none opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Mincha is thinking</span>
                  <div className="flex gap-1">
                    <div
                      className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-3xl mx-auto w-full p-4 md:p-6">
          <ChatInput onSend={handleSendMessage} disabled={loading} selectedTrek={selectedTrek} />
        </div>
      </div>
    </div>
  )
}
