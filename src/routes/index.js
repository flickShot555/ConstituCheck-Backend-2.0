import express from "express";
// Import route groups
//import vectorRoutes from "./vectorRoutes.js";
//import llmRoutes from "./llmRoutes.js";
//import firebaseRoutes from "./firebaseRoutes.js";
//import scenarioRoutes from "./scenarioRoutes.js";
const router = express.Router();

router.get("/health", (req,res)=>{
    res.json({status: "OK", message: "Backend connected successful"});
});

// Mount route groups
//router.use("/vector", vectorRoutes);
//router.use("/llm", llmRoutes);
//router.use("/firebase", firebaseRoutes);
//router.use("/scenario", scenarioRoutes);

export default router;