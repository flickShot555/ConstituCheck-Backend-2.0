// src/services/pythonBridge.js
import axios from "axios";

const PYTHON_API = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function requestVectorize(filePath) {
  // In your future implementation, call Python microservice
  const resp = await axios.post(`${PYTHON_API}/vectorize`, { file_path: filePath });
  return resp.data;
}

export async function requestRetrieveSimilar(text, top_k = 5) {
  const resp = await axios.post(`${PYTHON_API}/retrieve-similar`, { scenario_text: text, top_k });
  return resp.data;
}
