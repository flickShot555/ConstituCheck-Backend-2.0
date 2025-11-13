// src/controllers/llmController.js
import { callGemini } from "../services/llmService.js";

export async function completePrompt(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const out = await callGemini(prompt);
    res.json({ status: "ok", data: out });
  } catch (err) {
    res.status(500).json({ error: "LLM call failed" });
  }
}
