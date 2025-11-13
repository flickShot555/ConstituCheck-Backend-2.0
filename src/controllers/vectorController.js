// src/controllers/vectorController.js
import { simpleMostSimilar } from "../utils/helpers.js";
import { callGemini } from "../services/llmService.js";

/**
 * Hardcoded documents used to simulate vector-store retrieval
 * Each doc has: id, title, content, category
 */
const HARDCODED_DOCS = [
  {
    id: "doc-1",
    title: "Constitution Amendment - Free Speech",
    category: "Fundamental Rights",
    content:
      "Every citizen shall have freedom of speech and expression subject to reasonable restrictions for public order and security."
  },
  {
    id: "doc-2",
    title: "Constitution Amendment - Right to Privacy",
    category: "Fundamental Rights",
    content:
      "The privacy of every individual's correspondence and personal information shall be safeguarded by law, except as necessary for national security."
  },
  {
    id: "doc-3",
    title: "Criminal Procedure Act - Arrests",
    category: "Criminal Law",
    content:
      "Police may arrest without warrant where a person is reasonably suspected of committing a cognizable offence and where delay would frustrate the investigation."
  }
];

export async function uploadDocument(req, res) {
  // For FYP: accept JSON body { title, content, category }
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "title and content required" });
  }

  // In full version: save to disk, call python microservice to vectorize & upsert.
  // For demo: return a fake doc id and echo back.
  const docId = `demo-${Date.now()}`;
  return res.json({
    status: "ok",
    doc_id: docId,
    message: "Document accepted (demo mode). In production this triggers vectorization."
  });
}

export async function searchSimilar(req, res) {
  const { query, top_k = 1 } = req.body;
  if (!query) return res.status(400).json({ error: "query is required" });

  // Simple local similarity (word overlap / token overlap) to rank the 3 docs
  const ranked = HARDCODED_DOCS
    .map((d) => ({ ...d, score: simpleMostSimilar(query, d.content) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, top_k);

  // If you want to enrich using Gemini, you can call it (optional)
  // const llmResponse = await callGemini(query);

  return res.json({
    status: "ok",
    query,
    top_k,
    results: ranked.map((d) => ({
      doc_id: d.id,
      title: d.title,
      category: d.category,
      score: d.score,
      content: d.content // returns full original doc (for LLM usage)
    }))
  });
}
