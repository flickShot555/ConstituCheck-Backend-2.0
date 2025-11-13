// src/routes/index.js
import express from "express";
import vectorRoutes from "./vectorRoutes.js";
import llmRoutes from "./llmRoutes.js";

const router = express.Router();

router.use("/vector", vectorRoutes); // /api/vector/*
router.use("/llm", llmRoutes);       // /api/llm/*

export default router;
