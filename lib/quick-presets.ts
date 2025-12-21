// lib/quick-presets.ts

export type QuickPreset = {
  id: string;
  label: string;
  message: string;
  icon: string; // Heroicon name
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  culture?: string; // Optional culture tag
};

export const QUICK_START_PRESETS: QuickPreset[] = [
  {
    id: "cultural-immersion",
    label: "Quick Cultural Immersion",
    message: "I want to experience authentic Nepal culture for 3 days with moderate budget and easy to moderate trekking. Which trek do you recommend?",
    icon: "🎭", // Culture
    color: "primary",
  },
  {
    id: "budget-adventure",
    label: "Budget-Friendly Adventure",
    message: "I'm looking for an affordable 3-day trek under NPR 15,000 with good cultural experience and easy difficulty.",
    icon: "💰", // Budget
    color: "success",
  },
  {
    id: "spiritual-journey",
    label: "Spiritual Journey",
    message: "I'm interested in Buddhist and Hindu spiritual sites. What's the best 3-day trek for meditation and temple visits?",
    icon: "🧘", // Spiritual
    color: "accent",
    culture: "Buddhist/Hindu",
  },
  {
    id: "tea-gardens",
    label: "Tea Garden & Mountain Views",
    message: "I'd love to explore tea gardens, interact with local communities, and see mountain panoramas. Which trek?",
    icon: "🍃", // Tea
    color: "secondary",
    culture: "Limbu",
  },
];
