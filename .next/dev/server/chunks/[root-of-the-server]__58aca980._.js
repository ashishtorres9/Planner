module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/agentic-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrekAgentEngine",
    ()=>TrekAgentEngine
]);
class TrekAgentEngine {
    state;
    treks;
    constructor(treks){
        this.treks = treks;
        this.state = {
            conversationPhase: "greeting",
            extractedContext: {},
            recommendedTreks: [],
            selectedTrek: null,
            itineraryGenerated: false
        };
    }
    extractPreferences(messages) {
        const combined = messages.map((m)=>m.content).join(" ").toLowerCase();
        const context = {};
        // Budget detection
        if (combined.includes("budget") || combined.includes("cheap") || combined.includes("affordable")) {
            context.budget = "budget";
        } else if (combined.includes("luxury") || combined.includes("premium") || combined.includes("expensive")) {
            context.budget = "luxury";
        } else if (combined.includes("mid") || combined.includes("moderate")) {
            context.budget = "moderate";
        }
        // Fitness level detection
        if (combined.includes("beginner") || combined.includes("easy") || combined.includes("leisurely") || combined.includes("relaxed")) {
            context.fitnessLevel = "beginner";
        } else if (combined.includes("challenging") || combined.includes("athletic") || combined.includes("difficult") || combined.includes("expedition")) {
            context.fitnessLevel = "advanced";
        } else if (combined.includes("fit") || combined.includes("moderate") || combined.includes("regular")) {
            context.fitnessLevel = "moderate";
        }
        // Culture/interest detection
        context.interests = [];
        if (combined.includes("culture") || combined.includes("traditional")) context.interests.push("culture");
        if (combined.includes("mountain") || combined.includes("peak") || combined.includes("himalaya")) context.interests.push("mountain");
        if (combined.includes("village") || combined.includes("community")) context.interests.push("village");
        if (combined.includes("temple") || combined.includes("spiritual") || combined.includes("religious")) context.interests.push("spiritual");
        if (combined.includes("photography")) context.interests.push("photography");
        // Season detection
        if (combined.includes("spring") || combined.includes("april") || combined.includes("march")) {
            context.season = "spring";
        } else if (combined.includes("autumn") || combined.includes("october") || combined.includes("september")) {
            context.season = "autumn";
        } else if (combined.includes("winter") || combined.includes("december")) {
            context.season = "winter";
        }
        // Specific culture detection
        const cultureKeywords = {
            sherpa: [
                "sherpa",
                "solu",
                "khumbu",
                "everest"
            ],
            newari: [
                "newari",
                "kathmandu",
                "valley",
                "bhaktapur"
            ],
            tamang: [
                "tamang",
                "langtang",
                "helambu"
            ],
            sunuwar: [
                "sunuwar",
                "sakela",
                "panchthar"
            ],
            magar: [
                "magar",
                "dhulikhel",
                "nuwakot"
            ]
        };
        for (const [culture, keywords] of Object.entries(cultureKeywords)){
            if (keywords.some((kw)=>combined.includes(kw))) {
                context.culture = culture;
                break;
            }
        }
        return context;
    }
    recommendTreks(context) {
        let recommendations = [
            ...this.treks
        ];
        if (context.fitnessLevel) {
            if (context.fitnessLevel === "beginner") {
                recommendations = recommendations.filter((t)=>t.difficulty === "Easy");
            } else if (context.fitnessLevel === "advanced") {
                recommendations = recommendations.filter((t)=>t.difficulty === "Challenging" || t.difficulty === "Moderate");
            }
        }
        if (context.season) {
            recommendations = recommendations.filter((t)=>{
                const season = context.season;
                if (season === "spring") return t.bestSeason.includes("Mar") || t.bestSeason.includes("Apr");
                if (season === "autumn") return t.bestSeason.includes("Sep") || t.bestSeason.includes("Oct");
                if (season === "winter") return t.bestSeason.includes("Dec") || t.bestSeason.includes("Jan");
                return true;
            });
        }
        if (context.culture) {
            const cultureMap = {
                sherpa: "Sherpa",
                newari: "Newari",
                tamang: "Tamang",
                sunuwar: "Sunuwar",
                magar: "Magar"
            };
            const cultureValue = cultureMap[context.culture];
            if (cultureValue) {
                recommendations = recommendations.filter((t)=>t.culture === cultureValue);
            }
        }
        return recommendations.slice(0, 3);
    }
    updateConversationPhase(messages, selectedTrek) {
        const messageCount = messages.length;
        const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";
        if (selectedTrek && lastMessage.includes("itinerary")) {
            this.state.conversationPhase = "itinerary-planning";
        } else if (selectedTrek) {
            this.state.conversationPhase = "trek-selection";
        } else if (messageCount > 3 && (lastMessage.includes("prefer") || lastMessage.includes("budget"))) {
            this.state.conversationPhase = "preference-gathering";
        } else {
            this.state.conversationPhase = "greeting";
        }
    }
    async reason(messages, selectedTrek) {
        this.state.extractedContext = this.extractPreferences(messages);
        this.state.recommendedTreks = this.recommendTreks(this.state.extractedContext);
        this.state.selectedTrek = selectedTrek;
        this.updateConversationPhase(messages, selectedTrek);
        return this.state;
    }
    getState() {
        return this.state;
    }
}
}),
"[project]/lib/ai-config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AI_CONFIG",
    ()=>AI_CONFIG,
    "buildQwenPrompt",
    ()=>buildQwenPrompt,
    "getAIProvider",
    ()=>getAIProvider,
    "isQwenReady",
    ()=>isQwenReady
]);
const AI_CONFIG = {
    provider: process.env.QWEN_API_KEY ? "qwen" : "fallback",
    apiKey: process.env.QWEN_API_KEY || "",
    model: "deepinfra/qwen-2.5-72b-instruct",
    temperature: 0.8,
    maxTokens: 800,
    isConfigured: !!process.env.QWEN_API_KEY
};
function getAIProvider() {
    return AI_CONFIG.provider;
}
function isQwenReady() {
    return AI_CONFIG.isConfigured;
}
const buildQwenPrompt = (messages, selectedTrek)=>{
    const conversationHistory = messages.map((m)=>`${m.role === "user" ? "User" : "Mincha"}: ${m.content}`).join("\n");
    return `You are Mincha, a curious and enthusiastic Nepali travel guide with deep expertise in cultural trekking experiences. 
You help travelers plan authentic 3-day treks through Nepal's diverse cultural regions.

Your personality:
- Warm, engaging, and genuinely interested in travelers' stories
- Knowledgeable about Nepali cultures (Sherpa, Newari, Tamang, Sunuwar, etc.)
- Practical about logistics, budget, and fitness levels
- Passionate about authentic cultural experiences

Current conversation:
${conversationHistory}

${selectedTrek ? `Selected Trek: ${selectedTrek.name} (${selectedTrek.culture} culture in ${selectedTrek.region})` : ""}

Instructions:
1. Understand the user's travel style, budget, and interests from their messages
2. Recommend treks that match their preferences
3. For selected treks, create detailed 3-day itineraries with activities, accommodation, and local guides
4. Always be honest about difficulty levels and physical requirements
5. Suggest booking services (hotels, homestays, guides) that align with their budget
6. Mention WhatsApp booking options for local partners
7. Share cultural insights and tips about local customs
8. Keep responses concise (2-3 sentences max for engagement, longer only when requested)

Respond naturally and conversationally. If the user asks for an itinerary, format it clearly with day-by-day breakdown.`;
};
}),
"[project]/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$107_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ai@5.0.107_zod@3.25.76/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$deepinfra$40$1$2e$0$2e$29_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$ai$2d$sdk$2f$deepinfra$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+deepinfra@1.0.29_zod@3.25.76/node_modules/@ai-sdk/deepinfra/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agentic$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agentic-engine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai-config.ts [app-route] (ecmascript)");
;
;
;
;
const treksData = {
    treks: [
        {
            id: "sunuwar-1",
            name: "Sakela Trek",
            culture: "Sunuwar",
            region: "Panchthar",
            difficulty: "Moderate",
            bestSeason: "Oct-Nov, Mar-Apr",
            description: "Experience authentic Sunuwar traditions in the eastern hills",
            season: "Spring & Autumn",
            highlights: [
                "Sacred Sakela festival",
                "Sunuwar villages",
                "Traditional homestays"
            ]
        },
        {
            id: "sherpa-1",
            name: "Solu Khumbu Trek",
            culture: "Sherpa",
            region: "Solu-Khumbu",
            difficulty: "Challenging",
            bestSeason: "Sep-Oct, Mar-Apr",
            description: "Trek through Sherpa villages with stunning Himalayan views",
            season: "Autumn & Spring",
            highlights: [
                "Sherpa culture",
                "Mountain views",
                "Buddhist monasteries"
            ]
        },
        {
            id: "newari-1",
            name: "Nuwakot Trek",
            culture: "Newari",
            region: "Kathmandu Valley",
            difficulty: "Easy",
            bestSeason: "Oct-Nov, Feb-Apr",
            description: "Explore ancient Newari architecture and traditions",
            season: "Winter & Spring",
            highlights: [
                "Newari villages",
                "Ancient temples",
                "Traditional pottery"
            ]
        },
        {
            id: "tamang-1",
            name: "Tamang Heritage Trek",
            culture: "Tamang",
            region: "Langtang",
            difficulty: "Moderate",
            bestSeason: "Oct-Nov, Mar-Apr",
            description: "Immerse in Tamang mountain culture",
            season: "Autumn & Spring",
            highlights: [
                "Tamang villages",
                "Mountain views",
                "Local hospitality"
            ]
        }
    ]
};
function generateFallbackResponse(engine, messages, selectedTrek) {
    const state = engine.getState();
    const lastUserMessage = messages.filter((m)=>m.role === "user").slice(-1)[0]?.content || "";
    const userLower = lastUserMessage.toLowerCase();
    // Trek-specific responses
    if (selectedTrek) {
        const responses = [
            `Wonderful choice! The ${selectedTrek.name} offers an incredible journey through ${selectedTrek.culture} culture. This trek is ${selectedTrek.difficulty === "Easy" ? "gentle and suitable for all" : selectedTrek.difficulty === "Moderate" ? "moderately challenging" : "quite challenging"}. Best visited during ${selectedTrek.bestSeason}. Would you like me to create a detailed 3-day itinerary with accommodation and guide recommendations?`,
            `Perfect! I know the ${selectedTrek.name} trek well. The highlights include ${selectedTrek.highlights.slice(0, 2).join(" and ")}. With your ${state.extractedContext.budget || "moderate"} budget, you have wonderful homestay options. Shall I design your complete itinerary now?`,
            `Excellent! The ${selectedTrek.name} is unforgettable. Your ${state.extractedContext.fitnessLevel || "moderate"} fitness level pairs perfectly with this experience. Ready to lock in dates and book your guide?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    // Preference gathering responses
    if (userLower.includes("budget") || userLower.includes("fitness") || userLower.includes("prefer") || userLower.includes("interested")) {
        const recs = state.recommendedTreks;
        const responses = [
            `Perfect! Based on what you've shared, I'd recommend: ${recs.map((t)=>t.name).join(", ")}. Which of these calls to you?`,
            `Great insights! Here are my top picks for you: ${recs.slice(0, 2).map((t)=>`${t.name} (${t.culture})`).join(" or ")}. Tell me which sounds best!`,
            `You sound like an adventurer! These match your style: ${recs.map((t)=>t.name).join(", ")}. Which trek interests you most?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    // General engagement responses
    const generalResponses = [
        "I'd love to help! Tell me about your ideal trek - your budget, fitness level, and which Nepali cultures fascinate you?",
        "That's wonderful! To find your perfect match, what's your approximate budget and do you prefer challenging mountain hikes or leisurely cultural walks?",
        "Great question! Are you drawn to specific cultures, or shall I tell you about Sherpa, Newari, Tamang, and Sunuwar traditions?",
        "Exciting! What time of year are you thinking, and what's your fitness level like?"
    ];
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}
async function generateChatResponse(messages, selectedTrek) {
    const engine = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agentic$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TrekAgentEngine"](treksData.treks);
    await engine.reason(messages, selectedTrek);
    // If Qwen is configured, use it for richer responses
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isQwenReady"])()) {
        const prompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildQwenPrompt"])(messages.map((m)=>({
                role: m.role,
                content: m.content
            })), selectedTrek);
        // Try DeepInfra first if DEEPINFRA_API_KEY is explicitly set
        const deepInfraApiKey = process.env.DEEPINFRA_API_KEY;
        if (deepInfraApiKey) {
            try {
                console.log("[v0] Using DeepInfra/Qwen AI for response generation");
                const deepInfra = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$deepinfra$40$1$2e$0$2e$29_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$ai$2d$sdk$2f$deepinfra$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createDeepInfra"])({
                    apiKey: deepInfraApiKey
                });
                // Convert prompt to messages format for better compatibility
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$107_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
                    model: deepInfra("deepinfra/qwen-2.5-72b-instruct"),
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    maxOutputTokens: 800,
                    temperature: 0.8
                });
                return result.text;
            } catch (error) {
                console.log("[v0] DeepInfra call failed, falling back to DashScope:", error);
            // Fall through to DashScope fallback
            }
        }
        // Use DashScope API (QWEN_API_KEY or DASHSCOPE_API_KEY)
        const dashScopeApiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
        if (dashScopeApiKey) {
            try {
                console.log("[v0] Using DashScope/Qwen AI for response generation");
                const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${dashScopeApiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "qwen-plus",
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        max_tokens: 800,
                        temperature: 0.8
                    })
                });
                if (!res.ok) {
                    throw new Error(`DashScope API error: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                if (data.choices?.[0]?.message?.content) {
                    return data.choices[0].message.content.trim();
                }
                throw new Error("No content in DashScope response");
            } catch (error) {
                console.log("[v0] DashScope call failed, using intelligent fallback:", error);
                return generateFallbackResponse(engine, messages, selectedTrek);
            }
        }
        // If no API keys are available, use fallback
        console.log("[v0] No Qwen API keys configured, using intelligent fallback");
        return generateFallbackResponse(engine, messages, selectedTrek);
    }
    return generateFallbackResponse(engine, messages, selectedTrek);
}
async function POST(request) {
    try {
        const body = await request.json();
        const { messages, selectedTrek } = body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return Response.json({
                error: "Invalid messages format"
            }, {
                status: 400
            });
        }
        const engine = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agentic$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TrekAgentEngine"](treksData.treks);
        await engine.reason(messages, selectedTrek);
        const state = engine.getState();
        const response = await generateChatResponse(messages, selectedTrek);
        console.log("[v0] Agent phase:", state.conversationPhase);
        console.log("[v0] Extracted context:", state.extractedContext);
        console.log("[v0] Using Qwen:", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isQwenReady"])());
        return Response.json({
            response,
            suggestedTreks: state.recommendedTreks,
            generatedItinerary: null,
            agentState: {
                phase: state.conversationPhase,
                context: state.extractedContext
            }
        });
    } catch (error) {
        console.error("[v0] Chat API error:", error);
        return Response.json({
            response: "Let me gather my thoughts for a moment. Could you rephrase that in a different way?",
            suggestedTreks: [],
            generatedItinerary: null
        }, {
            status: 200
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__58aca980._.js.map