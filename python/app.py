#!/usr/bin/env python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import vectorize_and_upsert
import os

app = FastAPI(title="ConstituCheck Vectorization Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------
# Request Models
# -----------------------

class DocumentRequest(BaseModel):
    file_path: str

class ScenarioRequest(BaseModel):
    scenario_text: str
    top_k: Optional[int] = 5

class ClusterRequest(BaseModel):
    n_clusters: Optional[int] = 5

class VectorizeRequest(BaseModel):
    file_path: str

# -----------------------
# API Endpoints
# -----------------------

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/vectorize")
async def vectorize_document(req: DocumentRequest):
    if not req.file_path:
        raise HTTPException(status_code=400, detail="file_path is required")
    try:
        result = vectorize_and_upsert.process_and_upsert(req.file_path)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/retrieve-similar")
async def retrieve_similar(req: ScenarioRequest):
    try:
        results = vectorize_and_upsert.retrieve_similar(req.scenario_text, req.top_k)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cluster-documents")
async def cluster_documents(req: ClusterRequest):
    try:
        mapping = vectorize_and_upsert.cluster_documents(req.n_clusters)
        return {"status": "success", "vector_clusters": mapping}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000)