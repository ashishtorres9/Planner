"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage as ChatMessageType, Trek } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { MinchaChatAvatar } from "./mincha-chat-avatar";
import { decodeCulture, decodeDifficulty, decodeAccessibility, decodeSpiritual } from "@/lib/codes";
import { QUICK_START_PRESETS } from "@/lib/quick-presets";

// Load all data at build time
const TREKS_DATA = require("@/data/public/treks.json").treks as Trek[];
const ITINERARIES_DATA = require("@/data/public/itineraries.json");

// Currency conversion (NPR base)
const EXCHANGE_RATES = {
  NPR: 1,
  INR: 1.6,
  USD: 133,
  CNY: 18.5,
  LKR: 0.45,
  BDT: 1.2,
};

export function ChatPlanner() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Namaste! I'm Mincha, your curious travel guide. I'll help you find the perfect 3-day trek through Nepal's most authentic cultural regions. Tell me about yourself or choose one of my quick-start options below.",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
  const [showPresets, setShowPresets] = useState(true);
  const [userLanguage, setUserLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSystemPrompt = () => {
    const trekData = TREKS_DATA.map((trek) => ({
      id: trek.id,
      trek_code: trek.trek_code,
      name: trek.name,
      culture_group: trek.culture_group,
      region_id: trek.region_id,
      difficulty: trek.difficulty,
      min_npr: trek.min_npr,
      max_npr: trek.max_npr,
      spiritual_significance: trek.spiritual_significance,
      cultural_immersion: trek.cultural_immersion,
      accessibility: trek.accessibility,
      duration_days: trek.duration_days,
      highlights: trek.highlights,
    }));

    return `
You are Mincha, Heritage Hub Nepal's AI travel agent. Respond in ${userLanguage === "en" ? "English" : "the user's language"}.

Available treks (with codes and metadata):
${JSON.stringify(trekData, null, 2)}

ALWAYS reply with VALID JSON in this EXACT format:
{
  "response": "Your friendly reply.",
  "suggestedTrek": {
    "id": "string",
    "name": "string",
    "culture_group": "string",
    "region_id": "string",
    "difficulty": "string",
    "trek_code": "string",
    "min_npr": number,
    "max_npr": number,
    "spiritual_significance": "string",
    "cultural_immersion": "string",
    "accessibility": "string",
    "duration_days": number,
    "itineraryPreview": [
      { "day": 1, "title": "string", "meals": "string", "accommodation": "string", "transport": "string" }
    ],
    "whatsappLink": "https://wa.me/977984123456?text=...",
    "pdfUrl": "/itineraries/id.pdf"
  }
}
NEVER add markdown, explanations, or extra text. ONLY JSON.
`;
  };

  const handleSendMessage = async (userMessage: string) => {
    setShowPresets(false);
    const newUserMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const chatHistory = [
        { role: "system", content: getSystemPrompt() },
        ...messages.slice(1).map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ];

      const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY;
      if (!apiKey) throw new Error("Missing NEXT_PUBLIC_QWEN_API_KEY");

      const response = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-turbo",
          input: { messages: chatHistory },
          parameters: { result_format: "message", max_tokens: 1024 },
        }),
      });

      if (!response.ok) throw new Error("Qwen API error");
      const data = await response.json();
      const content = data.output.choices[0].message.content;

      let parsed;
      try {
        const jsonMatch = content.match(/```json\s*({.*?})\s*```/s);
        const cleanJson = jsonMatch ? jsonMatch[1] : content;
        parsed = JSON.parse(cleanJson);
      } catch (e) {
        throw new Error("Invalid JSON from Qwen");
      }

      if (parsed.suggestedTrek) {
        const itinerary = ITINERARIES_DATA[parsed.suggestedTrek.id];
        if (itinerary) {
          parsed.suggestedTrek.itineraryPreview = itinerary.itineraryDays.slice(0, 2).map((day) => ({
            day: day.dayNumber,
            title: day.title,
            meals: day.mealsIncluded || "",
            accommodation: day.accommodation?.type.join(", ") || "",
            transport: day.transport?.type.join(", ") || "",
          }));
        }
        parsed.suggestedTrek.whatsappLink = `https://wa.me/977984123456?text=${encodeURIComponent(
          `Namaka Mincha! I am interested in booking the ${parsed.suggestedTrek.name}.`
        )}`;
        parsed.suggestedTrek.pdfUrl = `/itineraries/${parsed.suggestedTrek.id}.pdf`;
      }

      const assistantMessage: ChatMessageType = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: parsed.response,
        timestamp: new Date(),
        suggestedTreks: parsed.suggestedTrek ? [parsed.suggestedTrek] : [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (parsed.suggestedTrek) setSelectedTrek(parsed.suggestedTrek);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessageType = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "Mincha is reflecting... Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrek = (trek: Trek) => {
    setSelectedTrek(trek);
    const userMsg = `Let's explore the ${trek.name} trek focusing on ${decodeCulture(trek.culture_group)} culture. Can you create a detailed 3-day itinerary?`;
    handleSendMessage(userMsg);
  };

  const handleSelectPreset = (preset: (typeof QUICK_START_PRESETS)[0]) => {
    handleSendMessage(preset.message);
  };

  const formatPriceRange = (minNpr: number, maxNpr: number, currency: string): string => {
    const rate = EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES] || 1;
    const min = Math.round(minNpr / rate);
    const max = Math.round(maxNpr / rate);
    if (min === max) return currency === "NPR" ? `₨ ${min.toLocaleString()}` : `${currency} ${min}`;
    return currency === "NPR" ? `₨ ${min.toLocaleString()}–${max.toLocaleString()}` : `${currency} ${min}–${max}`;
  };

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

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {messages.map((message, idx) => (
            <div key={message.id} style={{ animationDelay: `${idx * 50}ms` }}>
              {message.role === "assistant" && <MinchaChatAvatar />}
              <ChatMessage
                message={message}
                onSelectTrek={handleSelectTrek}
                decodeCulture={decodeCulture}
                decodeDifficulty={decodeDifficulty}
                decodeAccessibility={decodeAccessibility}
                decodeSpiritual={decodeSpiritual}
                formatPriceRange={formatPriceRange}
              />
            </div>
          ))}

          {/* ✨ BEAUTIFIED QUICK START PRESETS */}
          {showPresets && messages.length === 1 && (
            <div className="mt-8 space-y-4">
              <p className="text-sm font-medium text-foreground px-2 flex items-center gap-2">
                <span className="text-primary">✨</span> Start your journey with these authentic experiences:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUICK_START_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`
                      group relative overflow-hidden rounded-2xl border p-4 text-left
                      transition-all duration-300 hover:shadow-lg
                      before:absolute before:inset-0 before:z-[-1] before:opacity-0
                      before:bg-gradient-to-br before:from-${preset.color}-500/10 before:to-${preset.color}-600/10
                      hover:before:opacity-100
                      border-${preset.color}-400/30 hover:border-${preset.color}-500
                      bg-white/60 dark:bg-slate-900/60 backdrop-blur-md
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{preset.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground group-hover:text-${preset.color}-600 transition-colors">
                            {preset.label}
                          </h3>
                          {preset.culture && (
                            <span className={`text-[10px] bg-${preset.color}-100 text-${preset.color}-800 px-2 py-0.5 rounded-full`}>
                              {preset.culture}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {preset.message}
                        </p>
                      </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${preset.color}-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
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
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
  );
}
