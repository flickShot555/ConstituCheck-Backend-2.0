// src/routes/llmRoutes.js
import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { callGemini } from "../services/llmService.js";

const router = express.Router();

router.post("/complete", verifyFirebaseToken, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt required" });

  try {
    const out = await callGemini(prompt);
    return res.json({ status: "ok", data: out });
  } catch (err) {
    return res.status(500).json({ error: "LLM call failed" });
  }
});

export default router;
