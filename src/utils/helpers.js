// src/utils/helpers.js
/**
 * Very small similarity heuristic for demo:
 * - lowercase, split words, count overlap ratio
 * Returns a score between 0..1
 */
export function simpleMostSimilar(a, b) {
    if (!a || !b) return 0;
    const normalize = (s) =>
      s
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
  
    const wa = new Set(normalize(a));
    const wb = normalize(b);
  
    let matches = 0;
    for (const w of wb) if (wa.has(w)) matches++;
  
    return wb.length ? matches / wb.length : 0;
  }
  