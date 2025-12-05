import { generateText } from "ai"
import { createDeepInfra } from "@ai-sdk/deepinfra"
import type { Trek, ChatMessage as ChatMessageType } from "@/lib/types"
import { TrekAgentEngine } from "@/lib/agentic-engine"
import { buildQwenPrompt, isQwenReady } from "@/lib/ai-config"

const treksData = {
  treks: [
    {
      id: "sunuwar-1",
      name: "Sakela Trek",
      culture: "Sunuwar",
      region: "Panchthar",
      difficulty: "Moderate" as const,
      bestSeason: "Oct-Nov, Mar-Apr",
      description: "Experience authentic Sunuwar traditions in the eastern hills",
      season: "Spring & Autumn",
      highlights: ["Sacred Sakela festival", "Sunuwar villages", "Traditional homestays"],
    },
    {
      id: "sherpa-1",
      name: "Solu Khumbu Trek",
      culture: "Sherpa",
      region: "Solu-Khumbu",
      difficulty: "Challenging" as const,
      bestSeason: "Sep-Oct, Mar-Apr",
      description: "Trek through Sherpa villages with stunning Himalayan views",
      season: "Autumn & Spring",
      highlights: ["Sherpa culture", "Mountain views", "Buddhist monasteries"],
    },
    {
      id: "newari-1",
      name: "Nuwakot Trek",
      culture: "Newari",
      region: "Kathmandu Valley",
      difficulty: "Easy" as const,
      bestSeason: "Oct-Nov, Feb-Apr",
      description: "Explore ancient Newari architecture and traditions",
      season: "Winter & Spring",
      highlights: ["Newari villages", "Ancient temples", "Traditional pottery"],
    },
    {
      id: "tamang-1",
      name: "Tamang Heritage Trek",
      culture: "Tamang",
      region: "Langtang",
      difficulty: "Moderate" as const,
      bestSeason: "Oct-Nov, Mar-Apr",
      description: "Immerse in Tamang mountain culture",
      season: "Autumn & Spring",
      highlights: ["Tamang villages", "Mountain views", "Local hospitality"],
    },
  ],
}

function generateFallbackResponse(
  engine: TrekAgentEngine,
  messages: ChatMessageType[],
  selectedTrek: Trek | null,
): string {
  const state = engine.getState()
  const lastUserMessage = messages.filter((m) => m.role === "user").slice(-1)[0]?.content || ""
  const userLower = lastUserMessage.toLowerCase()

  // Trek-specific responses
  if (selectedTrek) {
    const responses = [
      `Wonderful choice! The ${selectedTrek.name} offers an incredible journey through ${selectedTrek.culture} culture. This trek is ${selectedTrek.difficulty === "Easy" ? "gentle and suitable for all" : selectedTrek.difficulty === "Moderate" ? "moderately challenging" : "quite challenging"}. Best visited during ${selectedTrek.bestSeason}. Would you like me to create a detailed 3-day itinerary with accommodation and guide recommendations?`,
      `Perfect! I know the ${selectedTrek.name} trek well. The highlights include ${selectedTrek.highlights.slice(0, 2).join(" and ")}. With your ${state.extractedContext.budget || "moderate"} budget, you have wonderful homestay options. Shall I design your complete itinerary now?`,
      `Excellent! The ${selectedTrek.name} is unforgettable. Your ${state.extractedContext.fitnessLevel || "moderate"} fitness level pairs perfectly with this experience. Ready to lock in dates and book your guide?`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Preference gathering responses
  if (
    userLower.includes("budget") ||
    userLower.includes("fitness") ||
    userLower.includes("prefer") ||
    userLower.includes("interested")
  ) {
    const recs = state.recommendedTreks
    const responses = [
      `Perfect! Based on what you've shared, I'd recommend: ${recs.map((t) => t.name).join(", ")}. Which of these calls to you?`,
      `Great insights! Here are my top picks for you: ${recs
        .slice(0, 2)
        .map((t) => `${t.name} (${t.culture})`)
        .join(" or ")}. Tell me which sounds best!`,
      `You sound like an adventurer! These match your style: ${recs.map((t) => t.name).join(", ")}. Which trek interests you most?`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // General engagement responses
  const generalResponses = [
    "I'd love to help! Tell me about your ideal trek - your budget, fitness level, and which Nepali cultures fascinate you?",
    "That's wonderful! To find your perfect match, what's your approximate budget and do you prefer challenging mountain hikes or leisurely cultural walks?",
    "Great question! Are you drawn to specific cultures, or shall I tell you about Sherpa, Newari, Tamang, and Sunuwar traditions?",
    "Exciting! What time of year are you thinking, and what's your fitness level like?",
  ]
  return generalResponses[Math.floor(Math.random() * generalResponses.length)]
}

async function generateChatResponse(messages: ChatMessageType[], selectedTrek: Trek | null): Promise<string> {
  const engine = new TrekAgentEngine(treksData.treks as Trek[])
  await engine.reason(messages, selectedTrek)

  // If Qwen is configured, use it for richer responses
  if (isQwenReady()) {
    const prompt = buildQwenPrompt(
      messages.map((m) => ({ role: m.role, content: m.content })),
      selectedTrek,
    )
    
    // Try DeepInfra first if DEEPINFRA_API_KEY is explicitly set
    const deepInfraApiKey = process.env.DEEPINFRA_API_KEY
    if (deepInfraApiKey) {
      try {
        console.log("[v0] Using DeepInfra/Qwen AI for response generation")
        const deepInfra = createDeepInfra({ apiKey: deepInfraApiKey })
        // Convert prompt to messages format for better compatibility
        const result = await generateText({
          model: deepInfra("deepinfra/qwen-2.5-72b-instruct"),
          messages: [{ role: "user", content: prompt }],
          maxOutputTokens: 800,
          temperature: 0.8,
        })
        return result.text
      } catch (error) {
        console.log("[v0] DeepInfra call failed, falling back to DashScope:", error)
        // Fall through to DashScope fallback
      }
    }
    
    // Use DashScope API (QWEN_API_KEY or DASHSCOPE_API_KEY)
    const dashScopeApiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY
    if (dashScopeApiKey) {
      try {
        console.log("[v0] Using DashScope/Qwen AI for response generation")
        const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${dashScopeApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "qwen-plus",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 800,
            temperature: 0.8,
          }),
        })
        
        if (!res.ok) {
          throw new Error(`DashScope API error: ${res.status} ${res.statusText}`)
        }
        
        const data = await res.json()
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content.trim()
        }
        throw new Error("No content in DashScope response")
      } catch (error) {
        console.log("[v0] DashScope call failed, using intelligent fallback:", error)
        return generateFallbackResponse(engine, messages, selectedTrek)
      }
    }
    
    // If no API keys are available, use fallback
    console.log("[v0] No Qwen API keys configured, using intelligent fallback")
    return generateFallbackResponse(engine, messages, selectedTrek)
  }

  return generateFallbackResponse(engine, messages, selectedTrek)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, selectedTrek } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const engine = new TrekAgentEngine(treksData.treks as Trek[])
    await engine.reason(messages, selectedTrek)
    const state = engine.getState()

    const response = await generateChatResponse(messages, selectedTrek)

    console.log("[v0] Agent phase:", state.conversationPhase)
    console.log("[v0] Extracted context:", state.extractedContext)
    console.log("[v0] Using Qwen:", isQwenReady())

    return Response.json({
      response,
      suggestedTreks: state.recommendedTreks,
      generatedItinerary: null,
      agentState: {
        phase: state.conversationPhase,
        context: state.extractedContext,
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json(
      {
        response: "Let me gather my thoughts for a moment. Could you rephrase that in a different way?",
        suggestedTreks: [],
        generatedItinerary: null,
      },
      { status: 200 },
    )
  }
}
