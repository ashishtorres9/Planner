import type { ChatContext } from "@/lib/types";
import itinerariesData from "@/data/itineraries.json";
import servicesData from "@/data/services.json";

export function matchItineraryToQuery(userQuery: string): {
  itineraryId: string | null;
  confidence: number;
  matchedKeywords: string[];
} {
  const queryLower = userQuery.toLowerCase();
  const matches: Array<{
    itineraryId: string;
    matchedCount: number;
    matchedKeywords: string[];
    confidence: number;
  }> = [];

  // Iterate through all itineraries and check keyword matches
  for (const [itineraryId, itinerary] of Object.entries(itinerariesData)) {
    const keywords = (itinerary as any).keywords || [];
    const matched = keywords.filter((kw: string) => 
      queryLower.includes(kw.toLowerCase())
    );
    
    if (matched.length > 0) {
      matches.push({
        itineraryId,
        matchedCount: matched.length,
        matchedKeywords: matched,
        confidence: matched.length / keywords.length,
      });
    }
  }

  if (matches.length === 0) {
    return { itineraryId: null, confidence: 0, matchedKeywords: [] };
  }

  // Return the best match (highest matched count)
  const best = matches.sort((a, b) => b.matchedCount - a.matchedCount)[0];
  return {
    itineraryId: best.itineraryId,
    confidence: best.confidence,
    matchedKeywords: best.matchedKeywords,
  };
}

export function injectCommissionLinks(itinerary: any, bookingAffiliateId: string): any {
  const updated = JSON.parse(JSON.stringify(itinerary));

  // Inject booking links into itinerary days
  if (updated.itinerary && Array.isArray(updated.itinerary)) {
    updated.itinerary = updated.itinerary.map((day: any) => {
      const dayCopy = { ...day };
      
      // Check activities for booking links
      if (dayCopy.activities && Array.isArray(dayCopy.activities)) {
        dayCopy.activities = dayCopy.activities.map((activity: any) => {
          if (activity.booking_link && typeof activity.booking_link === "string") {
            // Replace placeholder with actual service booking link
            const serviceKey = activity.booking_link
              .replace(/[{}]/g, "")
              .replace(/^booking_/, "");
            
            const service = (servicesData as any)[serviceKey];
            if (service?.booking_link) {
              activity.booking_link = service.booking_link;
            }
            if (service?.whatsappPhone) {
              activity.whatsapp_phone = service.whatsappPhone;
            }
            if (service?.whatsappMessage) {
              activity.whatsapp_message = service.whatsappMessage;
            }
          }
          return activity;
        });
      }

      // Check for accommodation references
      if (dayCopy.accommodation) {
        const accommodation = (servicesData as any)[dayCopy.accommodation];
        if (accommodation) {
          dayCopy.accommodation_booking_link = accommodation.booking_link || null;
          dayCopy.accommodation_whatsapp = accommodation.whatsappPhone || null;
          dayCopy.accommodation_whatsapp_message = accommodation.whatsappMessage || null;
        }
      }

      return dayCopy;
    });
  }

  // Handle guides if present
  if (updated.guides && Array.isArray(updated.guides)) {
    updated.guide_booking_links = updated.guides.map((guideId: string) => {
      const guide = (servicesData as any)[guideId];
      if (guide) {
        return {
          guide,
          whatsapp_link: guide.whatsappPhone
            ? `https://wa.me/${guide.whatsappPhone.replace(/\D/g, "")}?text=${encodeURIComponent(guide.whatsappMessage || "")}`
            : null,
        };
      }
      return null;
    }).filter(Boolean);
  }

  return updated;
}

export async function personalizeWithQwen(
  itinerary: any,
  userQuery: string,
  context: ChatContext
): Promise<string> {
  if (!process.env.DASHSCOPE_API_KEY && !process.env.QWEN_API_KEY) {
    return "";
  }

  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;

  try {
    const prompt = `You are Mincha, Heritage Hub Nepal's curious traveler guide.

User Request: "${userQuery}"
Selected Itinerary: ${itinerary.name}

Budget: $${context.budget || itinerary.budget_usd}
Fitness Level: ${context.fitnessLevel || "moderate"}
Interests: ${context.interests?.join(", ") || "cultural"}

Please provide:
1. A personalized narrative about this trek (2-3 sentences)
2. Budget adaptation if needed
3. One key recommendation based on their interests

Keep it warm, conversational, and authentic.`;

    const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.log("[v0] Qwen personalization failed, using default");
    return "";
  }
}

