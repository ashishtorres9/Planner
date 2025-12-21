// lib/types.ts

// ✅ Enhanced Trek interface for agentic system
export interface Trek {
  id: string;
  name: string;
  culture: string; // Fallback human-readable name (e.g., "Sunuwar")
  culture_group?: string; // Short code (e.g., "SUN") — used for filtering/decoding
  region: string; // e.g., "Panchthar District"
  region_id: string; // e.g., "eastern_hills_ilam" — links to regions.json
  difficulty: "E" | "M" | "C" | "H"; // Short codes for consistency
  bestSeason: string;
  description: string;
  season: string;
  highlights: string[];
  
  // ✅ NEW: Agentic fields from treks.json
  trek_code?: string; // e.g., "SUN-ILM-E-3D"
  min_npr: number; // NPR price range (min)
  max_npr: number; // NPR price range (max)
  duration_days: number; // 3 (not string)
  spiritual_significance?: "HIGH" | "MED" | "LOW" | "NONE";
  cultural_immersion?: "HIGH" | "MED" | "LOW";
  accessibility?: "EASY" | "MOD" | "HARD";
  traveler_fit?: string[]; // e.g., ["SL", "FM"]
  ecotourism_tier?: "A+" | "A" | "B";
}

// ✅ Keep other interfaces (optional: enhance Service too)
export interface Service {
  id: string;
  name: string;
  type: "homestay" | "hotel" | "guide";
  culture: string;
  description: string;
  pricePerNight?: number;
  pricePerDay?: number;
  rating?: number;
  bookingUrl: string;
  whatsapp: string;
}

export interface DayItinerary {
  day: number;
  highlight: string;
  description: string;
  activities: string[];
  altitude: string;
  distance: string;
  services?: Service[];
}

export interface Itinerary {
  trekId: string;
  days: DayItinerary[];
  summary: string;
  culturalTip: string;
}

// ✅ Enhanced ChatMessage to support itineraryPreview
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestedTreks?: Trek[];
  generatedItinerary?: Itinerary;
  
  // Optional: For rich preview without full Itinerary
  itineraryPreview?: Array<{
    day: number;
    title: string;
    meals: string;
    accommodation: string;
    transport: string;
  }>;
}

export interface ChatContext {
  budget?: string;
  fitnessLevel?: string;
  interests?: string[];
  duration?: string;
  season?: string;
  culture?: string;
  selectedTrek?: Trek;
}