import type { ChatContext } from "@/lib/types";
import { generateText } from "ai";

const itinerariesData = {
  "bodhi-trail": require("@/data/itineraries.json")["bodhi-trail"],
  "manaslu-foothills": require("@/data/itineraries.json")["manaslu-foothills"],
  "ilam-tea-loop": require("@/data/itineraries.json")["ilam-tea-loop"],
  "kavre-palanchok": require("@/data/itineraries.json")["kavre-palanchok"],
  "tamang-heritage": require("@/data/itineraries.json")["tamang-heritage"],
  "shivapuri-escape": require("@/data/itineraries.json")["shivapuri-escape"],
  "mustang-foothills": require("@/data/itineraries.json")["mustang-foothills"],
};

const servicesData = require("@/data/services.json");

function matchItineraryToQuery(userQuery: string): {
  itineraryId: string | null;
  confidence: number;
  matchedKeywords: string[];
} {
  const queryLower = userQuery.toLowerCase();
  const matches = [];

  const keywordMap = {
    "bodhi-trail": ["dhulikhel", "namobuddha", "buddhist", "pilgrimage", "bodhi", "sacred"],
    "manaslu-foothills": ["manaslu", "gurung", "gorkha", "foothills", "arughat", "mountain"],
    "ilam-tea-loop": ["ilam", "tea", "limbu", "kanyam", "eastern", "kanchenjunga"],
    "kavre-palanchok": ["kavre", "palanchok", "newari", "heritage", "dhulikhel", "pottery"],
    "tamang-heritage": ["tamang", "langtang", "heritage", "villages", "music", "culture"],
    "shivapuri-escape": ["shivapuri", "sacred", "hindu", "kathmandu", "temple", "spiritual"],
    "mustang-foothills": ["mustang", "tibetan", "hidden", "valley", "marpha", "desert"],
  };

  for (const [itineraryId, keywords] of Object.entries(keywordMap)) {
    const matched = (keywords as string[]).filter((kw) => queryLower.includes(kw));
    if (matched.length > 0) {
      matches.push({
        itineraryId,
        matchedCount: matched.length,
        matchedKeywords: matched,
        confidence: matched.length / (keywords as string[]).length,
      });
    }
  }

  if (matches.length === 0)
    return { itineraryId: null, confidence: 0, matchedKeywords: [] };

  const best = matches.sort((a, b) => b.matchedCount - a.matchedCount)[0];
  return {
    itineraryId: best.itineraryId as string,
    confidence: best.confidence,
    matchedKeywords: best.matchedKeywords,
  };
}

function injectCommissionLinks(itinerary: any, bookingAffiliateId: string): any {
  const updated = JSON.parse(JSON.stringify(itinerary));

  updated.itinerary = updated.itinerary.map((day: any) => ({
    ...day,
    accommodation_booking_link: servicesData[day.accommodation]?.booking_link || null,
    accommodation_whatsapp: servicesData[day.accommodation]?.whatsappPhone || null,
    accommodation_whatsapp_message: servicesData[day.accommodation]?.whatsappMessage || null,
  }));

  if (updated.guides && updated.guides.length > 0) {
    updated.guide_booking_links = updated.guides.map((guideId: string) => ({
      guide: servicesData[guideId],
      whatsapp_link: `https://wa.me/${servicesData[guideId]?.whatsappPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(servicesData[guideId]?.whatsappMessage || "")}`,
    }));
  }

  return updated;
}

async function personalizeWithQwen(
  itinerary: any,
  userQuery: string,
  context: ChatContext
): Promise<string> {
  if (!process.env.QWEN_API_KEY) {
    return "";
  }

  try {
    const { text } = await generateText({
      model: "deepinfra/qwen-2.5-72b-instruct",
      prompt: `You are Mincha, Heritage Hub Nepal's curious traveler guide.

User Request: "${userQuery}"
Selected Itinerary: ${itinerary.name}

Budget: $${context.budget || itinerary.budget_usd}
Fitness Level: ${context.fitnessLevel || "moderate"}
Interests: ${context.interests?.join(", ") || "cultural"}

Please provide:
1. A personalized narrative about this trek (2-3 sentences)
2. Budget adaptation if needed
3. One key recommendation based on their interests

Keep it warm, conversational, and authentic.`,
      maxTokens: 300,
      temperature: 0.7,
    });
    return text;
  } catch (error) {
    console.log("[v0] Qwen personalization failed, using default");
    return "";
  }
}

// ✅ MAIN EXPORT — ONLY THIS PART HAD THE SYNTAX ERROR
export async function POST(request: Request) {
  const body = await request.json();
  const { query } = body;

  if (!query || typeof query !== "string") {
    return Response.json({ error: "Query is required" }, { status: 400 });
  }

  const prompt = `
You are Mincha, a Nepal heritage expert. Plan a detailed, culturally respectful trip for:
"${query}"

Use this knowledge: ${JSON.stringify(require("@/data/nepal-knowledge.json"))}

Rules: Be practical, mention transport (e.g., "bus from KTM"), add tips (e.g., "remove shoes in temples"), use NPR pricing. Output in Markdown.
`;

  // ✅ FIXED: Use BACKTICKS for template literal
  const res = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.QWEN_API_KEY}`, // ← BACKTICKS!
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen3-max-preview",
      input: { messages: [{ role: "user", content: prompt }] },
    }),
  });

  const data = await res.json();
  return Response.json({
    content: data.output?.choices?.[0]?.message?.content || "Sorry, try again.",
    role: "assistant",
  });
}