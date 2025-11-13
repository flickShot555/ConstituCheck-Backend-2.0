// src/routes/vectorRoutes.js
import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { uploadDocument, searchSimilar } from "../controllers/vectorController.js";

const router = express.Router();

/**
 * Upload a document (admin). Since you're using local files,
 * the admin portal should upload via Node, which will store the file
 * and then trigger vectorization. For FYP we will accept file content
 * or a filePath and use hardcoded behaviour.
 */
router.post("/upload", verifyFirebaseToken, uploadDocument);

/**
 * Search similar documents (public endpoint or protected as needed)
 * Body: { query: "user text", top_k: 3 }
 */
router.post("/search", verifyFirebaseToken, searchSimilar);

export default router;

