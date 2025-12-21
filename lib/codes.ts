// lib/codes.ts

export const decodeCulture = (code: string): string => {
  const map: Record<string, string> = {
    "NWR": "Newari",
    "SUN": "Sunuwar",
    "TAM": "Tamang",
    "GUR": "Gurung",
    "LIM": "Limbu",
    "LOB": "Loba (Mustangi)"
  };
  return map[code] || code;
};

export const decodeDifficulty = (code: string): string => {
  const map: Record<string, string> = {
    "E": "Easy",
    "M": "Moderate",
    "C": "Challenging",
    "H": "Hard"
  };
  return map[code] || code;
};

export const decodeAccessibility = (code: string): string => {
  const map: Record<string, string> = {
    "EASY": "Easy",
    "MOD": "Moderate",
    "HARD": "Challenging"
  };
  return map[code] || code;
};

export const decodeSpiritual = (code: string): string => {
  const map: Record<string, string> = {
    "HIGH": "High",
    "MED": "Medium",
    "LOW": "Low",
    "NONE": "None"
  };
  return map[code] || code;
};