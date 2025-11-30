export interface Trek {
  id: string
  name: string
  culture: string
  region: string
  difficulty: "Easy" | "Moderate" | "Challenging"
  bestSeason: string
  description: string
  season: string
  highlights: string[]
}

export interface Service {
  id: string
  name: string
  type: "homestay" | "hotel" | "guide"
  culture: string
  description: string
  pricePerNight?: number
  pricePerDay?: number
  rating?: number
  bookingUrl: string
  whatsapp: string
}

export interface DayItinerary {
  day: number
  highlight: string
  description: string
  activities: string[]
  altitude: string
  distance: string
  services?: Service[]
}

export interface Itinerary {
  trekId: string
  days: DayItinerary[]
  summary: string
  culturalTip: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestedTreks?: Trek[]
  generatedItinerary?: Itinerary
}

export interface ChatContext {
  budget?: string
  fitnessLevel?: string
  interests?: string[]
  duration?: string
  season?: string
  culture?: string
  selectedTrek?: Trek
}
