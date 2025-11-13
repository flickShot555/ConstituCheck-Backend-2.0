// src/services/llmService.js
import axios from "axios";

const GEMINI_API_URL = process.env.GEMINI_API_URL || "https://api.gemini.google.com/v1/generate"; // Replace with actual URL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL_ID = process.env.GEMINI_MODEL_ID || "gemini-pro"; // Default to a placeholder model

async function callGemini(scenario, doc) {
  // Combine inputs into a single prompt
  const prompt = `
    Scenario:
    ${scenario}

    Context Document:
    ${doc}

    Question: Based on the above scenario and the attached document, provide a brief analysis of my scenario against the document.
    Act as my lawyer, not an AI chatbot. Keep answers short and avoid disclaimers or unnecessary details.
  `;

  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set — callGemini will return a placeholder.");
    console.log("Dear User,\nGemini not configured (demo mode)");
    return;
  }

  try {
    const payload = {
      model: GEMINI_MODEL_ID,
      prompt: prompt,
    };

    const resp = await axios.post(
      GEMINI_API_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const raw = resp.data.text || resp.data; // Adjust based on actual API response structure
    console.log("Dear User,\n", raw.trim());
  } catch (err) {
    console.error("Gemini call failed:", err?.message || err);
  }
}

// For now, just call on startup and exit
callGemini(userScenario, relevantDocument)
  .then(() => process.exit())
  .catch(() => process.exit(1));

export { callGemini };