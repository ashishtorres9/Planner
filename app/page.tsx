// app/page.tsx
import { ChatPlanner } from "@/components/chat-planner";
import type { Trek } from "@/lib/types";

const treks = require("@/data/public/treks.json").treks as Trek[];
const itineraries = require("@/data/public/itineraries.json");

export default function Home() {
  return <ChatPlanner initialTreks={treks} initialItineraries={itineraries} />;
}
