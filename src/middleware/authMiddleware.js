// src/middleware/authMiddleware.js
import admin from "firebase-admin";

/**
 * Expects Authorization: Bearer <idToken>
 */
export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decoded;
    return next();
  } catch (err) {
    console.error("Firebase token verify failed:", err?.message || err);
    return res.status(401).json({ error: "Invalid auth token" });
  }
}
