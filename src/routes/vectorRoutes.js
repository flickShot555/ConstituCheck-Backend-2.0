import express from "express";
import multer from "multer";
import axios from "axios";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // folder relative to workspace

router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);

    // Notify Python microservice
    const pythonResponse = await axios.post("http://localhost:8000/vectorize", {
      file_path: filePath,
    });

    res.json({
      status: "success",
      message: "File uploaded and vectorized successfully",
      python_response: pythonResponse.data,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
