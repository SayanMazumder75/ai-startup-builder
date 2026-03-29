const axios = require("axios");

// ─── Current Groq models (as of 2025) ────────────────────────────────────────
// llama-3.3-70b-versatile   ← best quality, recommended
// llama-3.1-8b-instant      ← fastest, lower quality
// mixtral-8x7b-32768        ← good balance
// gemma2-9b-it              ← Google Gemma
// ─────────────────────────────────────────────────────────────────────────────

// ─── Master Prompt Builder ────────────────────────────────────────────────────
const buildStartupPrompt = (idea) => `
You are an expert startup consultant, product designer, and business strategist.
A user has submitted the following startup idea: "${idea}"

Generate a COMPLETE startup kit. You MUST respond with ONLY valid JSON — no markdown, no explanation, no code fences. 
Return exactly this structure:

{
  "landingPage": {
    "hero": {
      "headline": "string (punchy, compelling headline)",
      "subheadline": "string (1-2 sentence value proposition)",
      "ctaText": "string (call-to-action button text)",
      "ctaSecondary": "string (secondary CTA text)"
    },
    "features": [
      { "icon": "string (emoji)", "title": "string", "description": "string (2-3 sentences)" },
      { "icon": "string (emoji)", "title": "string", "description": "string (2-3 sentences)" },
      { "icon": "string (emoji)", "title": "string", "description": "string (2-3 sentences)" },
      { "icon": "string (emoji)", "title": "string", "description": "string (2-3 sentences)" },
      { "icon": "string (emoji)", "title": "string", "description": "string (2-3 sentences)" },
      { "icon": "string (emoji)", "title": "string", "description": "string (2-3 sentences)" }
    ],
    "pricing": [
      { "name": "string", "price": "string", "period": "string", "description": "string", "features": ["string","string","string","string"], "highlighted": false },
      { "name": "string", "price": "string", "period": "string", "description": "string", "features": ["string","string","string","string","string"], "highlighted": true },
      { "name": "string", "price": "string", "period": "string", "description": "string", "features": ["string","string","string","string","string","string"], "highlighted": false }
    ],
    "testimonials": [
      { "name": "string", "role": "string", "company": "string", "text": "string" },
      { "name": "string", "role": "string", "company": "string", "text": "string" },
      { "name": "string", "role": "string", "company": "string", "text": "string" }
    ],
    "faq": [
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" }
    ]
  },
  "businessPlan": {
    "executiveSummary": "string (3-4 sentences)",
    "problem": {
      "statement": "string (2-3 sentences describing the core problem)",
      "painPoints": ["string", "string", "string", "string"]
    },
    "solution": {
      "description": "string (3-4 sentences describing the solution)",
      "keyDifferentiators": ["string", "string", "string"]
    },
    "targetAudience": {
      "primarySegment": "string",
      "demographics": "string",
      "psychographics": "string",
      "marketSize": "string (TAM/SAM/SOM estimate)"
    },
    "revenueModel": {
      "primaryRevenue": "string",
      "streams": ["string", "string", "string"],
      "projections": {
        "year1": "string",
        "year2": "string",
        "year3": "string"
      }
    },
    "marketingStrategy": {
      "channels": ["string", "string", "string", "string"],
      "tactics": ["string", "string", "string"],
      "gtmStrategy": "string (2-3 sentences)"
    },
    "competitiveAdvantage": ["string", "string", "string"],
    "milestones": [
      { "phase": "Month 1-3", "goal": "string" },
      { "phase": "Month 4-6", "goal": "string" },
      { "phase": "Month 7-12", "goal": "string" },
      { "phase": "Year 2", "goal": "string" }
    ],
    "risks": [
      { "risk": "string", "mitigation": "string" },
      { "risk": "string", "mitigation": "string" },
      { "risk": "string", "mitigation": "string" }
    ]
  },
  "branding": {
    "nameOptions": [
      { "name": "string", "rationale": "string", "domain": "string (suggested .com domain)" },
      { "name": "string", "rationale": "string", "domain": "string" },
      { "name": "string", "rationale": "string", "domain": "string" },
      { "name": "string", "rationale": "string", "domain": "string" }
    ],
    "tagline": "string (short, memorable tagline)",
    "brandPersonality": ["string", "string", "string", "string"],
    "logoDescription": "string (detailed description of logo concept, shapes, symbolism)",
    "colorPalette": {
      "primary": { "name": "string", "hex": "string", "usage": "string" },
      "secondary": { "name": "string", "hex": "string", "usage": "string" },
      "accent": { "name": "string", "hex": "string", "usage": "string" },
      "background": { "name": "string", "hex": "string", "usage": "string" },
      "text": { "name": "string", "hex": "string", "usage": "string" }
    },
    "typography": {
      "heading": "string (font name + style rationale)",
      "body": "string (font name + style rationale)"
    },
    "brandVoice": "string (description of brand tone and communication style)"
  },
  "pitchDeck": {
    "slides": [
      { "number": 1, "title": "Title Slide", "content": ["string - company name and tagline"], "speakerNotes": "string" },
      { "number": 2, "title": "The Problem", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 3, "title": "Our Solution", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 4, "title": "Market Opportunity", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 5, "title": "Product Demo", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 6, "title": "Business Model", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 7, "title": "Traction & Metrics", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 8, "title": "Competitive Landscape", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 9, "title": "The Team", "content": ["string", "string", "string"], "speakerNotes": "string" },
      { "number": 10, "title": "The Ask", "content": ["string", "string", "string"], "speakerNotes": "string" }
    ],
    "investorFAQ": [
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" },
      { "question": "string", "answer": "string" }
    ]
  }
}

Make all content specific, realistic, and tailored to the idea: "${idea}". 
Use real-sounding metrics and compelling language. Return ONLY the JSON object.
`;

// ─── Main Generation Function ─────────────────────────────────────────────────
const generateStartupKit = async (idea) => {
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const maxTokens = parseInt(process.env.MAX_TOKENS || "4000", 10);

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: buildStartupPrompt(idea) }],
        temperature: 0.7,
        max_tokens: maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const rawText = response.data.choices[0].message.content.trim();

    // Strip any accidental markdown fences
    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return JSON.parse(jsonText);

  } catch (error) {
    const groqMsg = error.response?.data?.error?.message;
    console.error("Groq Error:", error.response?.data || error.message);

    if (groqMsg?.includes("decommissioned")) {
      throw new Error(
        `Model "${model}" is decommissioned. Set GROQ_MODEL=llama-3.3-70b-versatile in your .env`
      );
    }
    if (error.response?.status === 401) {
      throw new Error("Invalid Groq API key. Check GROQ_API_KEY in your .env file.");
    }
    if (error.response?.status === 429) {
      throw new Error("Groq rate limit hit. Please wait a moment and try again.");
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out. Try again or switch to llama-3.1-8b-instant.");
    }

    throw new Error(groqMsg || error.message || "Groq request failed");
  }
};

module.exports = { generateStartupKit };
