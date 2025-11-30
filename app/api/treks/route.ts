import type { Trek } from "@/lib/types"

const trekkingData: Trek[] = [
  {
    id: "sunuwar-panchthar",
    name: "Panchthar Cultural Trek",
    culture: "sunuwar",
    region: "Panchthar District",
    difficulty: "Easy",
    bestSeason: "September-November",
    description:
      "Explore the heart of Sunuwar culture in Panchthar, experiencing traditional homestays and the famous Sakela festival celebrations.",
    highlights: [
      "Sakela festival traditions",
      "Sunuwar homestays",
      "Tea gardens of Panchthar",
      "Local cuisine experiences",
    ],
  },
  {
    id: "sherpa-solu",
    name: "Solu Khumbu Sherpa Trek",
    culture: "sherpa",
    region: "Solu-Khumbu",
    difficulty: "Moderate",
    bestSeason: "March-May",
    description:
      "Trek through Sherpa villages, visit monasteries, and experience the spiritual culture of the Khumbu region.",
    highlights: ["Tengboche Monastery", "Sherpa hospitality", "Rhododendron forests", "Mountain views"],
  },
  {
    id: "newari-bhaktapur",
    name: "Newari Heritage Trek",
    culture: "newari",
    region: "Bhaktapur & Nuwakot",
    difficulty: "Easy",
    bestSeason: "October-November",
    description:
      "Walk through ancient Newari settlements, visit traditional courtyards, and learn about centuries-old architecture and customs.",
    highlights: ["Bhaktapur Durbar Square", "Traditional pottery", "Ancient temples", "Local markets"],
  },
  {
    id: "tamang-langtang",
    name: "Langtang Tamang Trek",
    culture: "tamang",
    region: "Langtang Valley",
    difficulty: "Moderate",
    bestSeason: "May-September",
    description:
      "Experience Tamang villages, traditional music, and the stunning Langtang Valley surrounded by snow-capped peaks.",
    highlights: ["Langtang Valley", "Tamang villages", "Traditional music nights", "Alpine meadows"],
  },
  {
    id: "gurung-pokhara",
    name: "Annapurna Gurung Trek",
    culture: "gurung",
    region: "Pokhara & Annapurna",
    difficulty: "Moderate",
    bestSeason: "October-April",
    description:
      "Trek through Gurung settlements with views of Annapurna massif, experiencing traditional hospitality and mountain cuisine.",
    highlights: ["Annapurna views", "Gurung hospitality", "Mohare Danda", "Traditional farming"],
  },
  {
    id: "limbu-makalu",
    name: "Limbu Forest Trek",
    culture: "limbu",
    region: "Makalu & Ilam",
    difficulty: "Challenging",
    bestSeason: "March-May",
    description:
      "Deep dive into Limbu culture with forest trails, traditional hunting practices, and pristine wilderness experiences.",
    highlights: ["Pristine forests", "Limbu villages", "Makalu views", "Wildlife encounters"],
  },
]

export async function GET() {
  try {
    return Response.json(trekkingData)
  } catch (error) {
    console.error("[v0] Error returning treks:", error)
    return Response.json({ error: "Failed to load treks" }, { status: 500 })
  }
}
