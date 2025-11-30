import type { ChatMessage, Trek, ChatContext } from "./types"

interface AgentState {
  conversationPhase: "greeting" | "preference-gathering" | "trek-selection" | "itinerary-planning" | "booking"
  extractedContext: ChatContext
  recommendedTreks: Trek[]
  selectedTrek: Trek | null
  itineraryGenerated: boolean
}

export class TrekAgentEngine {
  private state: AgentState
  private treks: Trek[]

  constructor(treks: Trek[]) {
    this.treks = treks
    this.state = {
      conversationPhase: "greeting",
      extractedContext: {},
      recommendedTreks: [],
      selectedTrek: null,
      itineraryGenerated: false,
    }
  }

  extractPreferences(messages: ChatMessage[]): ChatContext {
    const combined = messages
      .map((m) => m.content)
      .join(" ")
      .toLowerCase()

    const context: ChatContext = {}

    // Budget detection
    if (combined.includes("budget") || combined.includes("cheap") || combined.includes("affordable")) {
      context.budget = "budget"
    } else if (combined.includes("luxury") || combined.includes("premium") || combined.includes("expensive")) {
      context.budget = "luxury"
    } else if (combined.includes("mid") || combined.includes("moderate")) {
      context.budget = "moderate"
    }

    // Fitness level detection
    if (
      combined.includes("beginner") ||
      combined.includes("easy") ||
      combined.includes("leisurely") ||
      combined.includes("relaxed")
    ) {
      context.fitnessLevel = "beginner"
    } else if (
      combined.includes("challenging") ||
      combined.includes("athletic") ||
      combined.includes("difficult") ||
      combined.includes("expedition")
    ) {
      context.fitnessLevel = "advanced"
    } else if (combined.includes("fit") || combined.includes("moderate") || combined.includes("regular")) {
      context.fitnessLevel = "moderate"
    }

    // Culture/interest detection
    context.interests = []
    if (combined.includes("culture") || combined.includes("traditional")) context.interests.push("culture")
    if (combined.includes("mountain") || combined.includes("peak") || combined.includes("himalaya"))
      context.interests.push("mountain")
    if (combined.includes("village") || combined.includes("community")) context.interests.push("village")
    if (combined.includes("temple") || combined.includes("spiritual") || combined.includes("religious"))
      context.interests.push("spiritual")
    if (combined.includes("photography")) context.interests.push("photography")

    // Season detection
    if (combined.includes("spring") || combined.includes("april") || combined.includes("march")) {
      context.season = "spring"
    } else if (combined.includes("autumn") || combined.includes("october") || combined.includes("september")) {
      context.season = "autumn"
    } else if (combined.includes("winter") || combined.includes("december")) {
      context.season = "winter"
    }

    // Specific culture detection
    const cultureKeywords = {
      sherpa: ["sherpa", "solu", "khumbu", "everest"],
      newari: ["newari", "kathmandu", "valley", "bhaktapur"],
      tamang: ["tamang", "langtang", "helambu"],
      sunuwar: ["sunuwar", "sakela", "panchthar"],
      magar: ["magar", "dhulikhel", "nuwakot"],
    }

    for (const [culture, keywords] of Object.entries(cultureKeywords)) {
      if (keywords.some((kw) => combined.includes(kw))) {
        context.culture = culture
        break
      }
    }

    return context
  }

  recommendTreks(context: ChatContext): Trek[] {
    let recommendations = [...this.treks]

    if (context.fitnessLevel) {
      if (context.fitnessLevel === "beginner") {
        recommendations = recommendations.filter((t) => t.difficulty === "Easy")
      } else if (context.fitnessLevel === "advanced") {
        recommendations = recommendations.filter((t) => t.difficulty === "Challenging" || t.difficulty === "Moderate")
      }
    }

    if (context.season) {
      recommendations = recommendations.filter((t) => {
        const season = context.season
        if (season === "spring") return t.bestSeason.includes("Mar") || t.bestSeason.includes("Apr")
        if (season === "autumn") return t.bestSeason.includes("Sep") || t.bestSeason.includes("Oct")
        if (season === "winter") return t.bestSeason.includes("Dec") || t.bestSeason.includes("Jan")
        return true
      })
    }

    if (context.culture) {
      const cultureMap: Record<string, string> = {
        sherpa: "Sherpa",
        newari: "Newari",
        tamang: "Tamang",
        sunuwar: "Sunuwar",
        magar: "Magar",
      }
      const cultureValue = cultureMap[context.culture]
      if (cultureValue) {
        recommendations = recommendations.filter((t) => t.culture === cultureValue)
      }
    }

    return recommendations.slice(0, 3)
  }

  updateConversationPhase(messages: ChatMessage[], selectedTrek: Trek | null) {
    const messageCount = messages.length
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ""

    if (selectedTrek && lastMessage.includes("itinerary")) {
      this.state.conversationPhase = "itinerary-planning"
    } else if (selectedTrek) {
      this.state.conversationPhase = "trek-selection"
    } else if (messageCount > 3 && (lastMessage.includes("prefer") || lastMessage.includes("budget"))) {
      this.state.conversationPhase = "preference-gathering"
    } else {
      this.state.conversationPhase = "greeting"
    }
  }

  async reason(messages: ChatMessage[], selectedTrek: Trek | null): Promise<AgentState> {
    this.state.extractedContext = this.extractPreferences(messages)
    this.state.recommendedTreks = this.recommendTreks(this.state.extractedContext)
    this.state.selectedTrek = selectedTrek
    this.updateConversationPhase(messages, selectedTrek)

    return this.state
  }

  getState() {
    return this.state
  }
}
