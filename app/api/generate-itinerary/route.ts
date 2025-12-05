import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createDeepInfra } from "@ai-sdk/deepinfra"
import type { Trek, Itinerary } from "@/lib/types"

const servicesData = {
  services: [
    {
      id: "homestay-sunuwar-1",
      name: "Sakela Homestay Panchthar",
      type: "homestay",
      culture: "sunuwar",
      pricePerNight: 25,
      rating: 4.8,
      description: "Authentic Sunuwar family homestay with home-cooked meals",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000001",
    },
    {
      id: "guide-sunuwar-1",
      name: "Ramesh - Sunuwar Cultural Guide",
      type: "guide",
      culture: "sunuwar",
      pricePerDay: 35,
      rating: 4.9,
      description: "Expert guide fluent in Sunuwar traditions and language",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000002",
    },
    {
      id: "hotel-sherpa-1",
      name: "Sherpa Peak Hotel Solu",
      type: "hotel",
      culture: "sherpa",
      pricePerNight: 40,
      rating: 4.7,
      description: "Modern hotel with Sherpa hospitality and mountain views",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000003",
    },
    {
      id: "guide-sherpa-1",
      name: "Pemba - Sherpa Trekking Expert",
      type: "guide",
      culture: "sherpa",
      pricePerDay: 45,
      rating: 5.0,
      description: "Experienced Sherpa guide with deep cultural knowledge",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000004",
    },
    {
      id: "homestay-newari-1",
      name: "Newari Cultural Homestay",
      type: "homestay",
      culture: "newari",
      pricePerNight: 30,
      rating: 4.8,
      description: "Traditional Newari architecture with authentic experiences",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000005",
    },
    {
      id: "guide-newari-1",
      name: "Bishnu - Newari Heritage Guide",
      type: "guide",
      culture: "newari",
      pricePerDay: 40,
      rating: 4.8,
      description: "Specialist in Newari art, architecture, and traditions",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000006",
    },
  ],
}

// No API key needed initially - upgrade to Qwen when DEEPINFRA_API_KEY is set
async function generateItineraryWithAI(trek: Trek): Promise<Itinerary> {
  try {
    const relevantServices = servicesData.services.filter((s) => s.culture === trek.culture.toLowerCase())

    const prompt = `You are an expert Nepal cultural travel planner. Generate a detailed, authentic 3-day cultural itinerary for the ${trek.name} trek in ${trek.region}, focusing on ${trek.culture} culture.

Culture details: ${trek.description}
Season: ${trek.season}
Difficulty: ${trek.difficulty}

Available services: ${JSON.stringify(relevantServices)}

Create a JSON response with this exact structure:
{
  "days": [
    {
      "day": 1,
      "highlight": "...",
      "description": "...",
      "activities": ["activity1", "activity2", "activity3", "activity4"],
      "altitude": "...",
      "distance": "...",
      "serviceIds": ["id1", "id2"]
    },
    {
      "day": 2,
      "highlight": "...",
      "description": "...",
      "activities": ["activity1", "activity2", "activity3", "activity4"],
      "altitude": "...",
      "distance": "...",
      "serviceIds": ["id2", "id3"]
    },
    {
      "day": 3,
      "highlight": "...",
      "description": "...",
      "activities": ["activity1", "activity2", "activity3"],
      "altitude": "...",
      "distance": "...",
      "serviceIds": ["id1"]
    }
  ],
  "summary": "...",
  "culturalTip": "..."
}`

    // Use OpenAI provider if OPENAI_API_KEY is available, otherwise use DeepInfra/Qwen
    const openaiApiKey = process.env.OPENAI_API_KEY
    const deepInfraApiKey = process.env.DEEPINFRA_API_KEY || process.env.QWEN_API_KEY
    
    let text: string
    
    if (openaiApiKey) {
      const openai = createOpenAI({ apiKey: openaiApiKey })
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
      })
      text = result.text
    } else if (deepInfraApiKey) {
      // Use DeepInfra/Qwen when DEEPINFRA_API_KEY is set
      const deepInfra = createDeepInfra({ apiKey: deepInfraApiKey })
      const result = await generateText({
        model: deepInfra("deepinfra/qwen-2.5-72b-instruct"),
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
      })
      text = result.text
    } else {
      throw new Error("No AI API key configured. Please set OPENAI_API_KEY, DEEPINFRA_API_KEY, or QWEN_API_KEY")
    }

    console.log("[v0] AI generation successful")
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid AI response format")

    const aiData = JSON.parse(jsonMatch[0])

    return {
      trekId: trek.id,
      days: aiData.days.map((day: any) => ({
        ...day,
        services: day.serviceIds.map((id: string) => servicesData.services.find((s) => s.id === id)).filter(Boolean),
      })),
      summary: aiData.summary,
      culturalTip: aiData.culturalTip,
    }
  } catch (error) {
    console.error("[v0] AI generation failed, using fallback:", error)
    return generateItineraryFallback(trek)
  }
}

function generateItineraryFallback(trek: Trek): Itinerary {
  const relevantServices = servicesData.services.filter((s) => s.culture === trek.culture.toLowerCase())

  return {
    trekId: trek.id,
    days: [
      {
        day: 1,
        highlight: `Welcome to ${trek.culture} Culture`,
        description: `Begin your journey in the heart of ${trek.region}. Settle into your accommodation and meet your local guide.`,
        activities: [
          "Arrival and check-in",
          "Meet local cultural guide",
          "Tour local area and markets",
          "Traditional welcome dinner",
        ],
        altitude: "1,500m",
        distance: "Local",
        services: relevantServices.slice(0, 2),
      },
      {
        day: 2,
        highlight: `Deep Cultural Immersion`,
        description: `Full day of authentic cultural experiences and interaction with local communities.`,
        activities: [
          "Morning trek through traditional villages",
          "Visit local temples or sacred sites",
          "Participate in traditional activities",
          "Learning session with local artisans",
        ],
        altitude: "2,000m",
        distance: "6-7 hours",
        services: relevantServices.slice(1, 3),
      },
      {
        day: 3,
        highlight: `Cultural Exchange & Departure`,
        description: `Final day of experiences and memories before your departure.`,
        activities: [
          "Morning meditation or reflection",
          "Last cultural interactions",
          "Local handicraft shopping",
          "Farewell with new friends",
        ],
        altitude: "1,500m",
        distance: "3-4 hours",
        services: relevantServices.slice(0, 1),
      },
    ],
    summary: `Immerse yourself in authentic ${trek.culture} culture through homestays, guided experiences, and genuine community connections in ${trek.region}.`,
    culturalTip: `The ${trek.culture} people are known for their exceptional hospitality and deep spiritual connection to the Himalayan landscape.`,
  }
}

export async function POST(request: Request) {
  try {
    const { trek } = await request.json()
    if (!trek || !trek.id) {
      return Response.json({ error: "Invalid trek data" }, { status: 400 })
    }

    const itinerary = await generateItineraryWithAI(trek)
    return Response.json(itinerary)
  } catch (error) {
    console.error("[v0] Itinerary generation error:", error)
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
