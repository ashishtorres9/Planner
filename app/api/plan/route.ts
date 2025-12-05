// app/api/chat/route.ts
import type { ChatContext } from "@/lib/types";
import { matchItineraryToQuery, injectCommissionLinks } from "./utils";
import itinerariesData from "@/data/itineraries.json";
import servicesData from "@/data/services.json";




export async function POST(request: Request) {
  console.log("➡️ DASHSCOPE_API_KEY present?", !!process.env.DASHSCOPE_API_KEY);
console.log("➡️ Key prefix:", process.env.DASHSCOPE_API_KEY?.substring(0, 8) + "...");
  const body = await request.json();
  const { query, context }: { query: string; context?: ChatContext } = body;

  if (!query || typeof query !== "string") {
    return Response.json({ error: "Query is required (string)" }, { status: 400 });
  }

  const match = matchItineraryToQuery(query);
  let enrichedItinerary = null;
  let narrative = "";

  const rawItinerary = match.itineraryId ? (itinerariesData as any)[match.itineraryId] : null;

  if (rawItinerary && match.confidence >= 0.2) {
    enrichedItinerary = injectCommissionLinks(rawItinerary, "AFFILIATE123");

    const prompt = `You are Mincha, Heritage Hub Nepal's friendly local guide.

User Request: "${query}"
Selected Itinerary: ${rawItinerary.name}
Budget: $${context?.budget || rawItinerary.budget_usd}
Fitness Level: ${context?.fitnessLevel || "moderate"}
Interests: ${context?.interests?.join(", ") || "cultural"}

Reply in warm, conversational English. Include:
1. A 2–3 sentence intro to this itinerary
2. One practical adaptation (transport, budget, timing)
3. One culturally respectful tip

Keep it under 120 words.`;

    try {
      const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
        // ✅ NO TRAILING SPACES ↑
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[DashScope] HTTP ${res.status}:`, errText);
        throw new Error(`DashScope error: ${res.status}`);
      }

      const data = await res.json();
      narrative = data?.choices?.[0]?.message?.content?.trim() || "";
    } catch (error) {
      console.error("[DashScope] Failed to generate narrative:", error);
      narrative = `Explore the ${rawItinerary.name} — a beautiful cultural journey in Nepal.`;
    }
  }

  // Fallback if no itinerary matched
  if (!narrative) {
    const fallbackPrompt = `You are Mincha, a Nepal heritage expert. Suggest one culturally respectful trip idea in Nepal for: "${query}". Mention region, transport (e.g., bus from Kathmandu), and one etiquette tip. Keep under 100 words.`;

    try {
      const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-turbo",
          messages: [{ role: "user", content: fallbackPrompt }],
          max_tokens: 150,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        narrative = data?.choices?.[0]?.message?.content?.trim() || "Let me know more — I'll craft your perfect Nepali journey!";
      }
    } catch (err) {
      console.error("[Fallback] DashScope failed:", err);
      narrative = "Namaste! 🙏 Our local team is preparing a custom plan just for you.";
    }
  }

  return Response.json({
    success: true,
    query,
    matched_itinerary: match,
    itinerary: enrichedItinerary,
    narrative,
  });
}