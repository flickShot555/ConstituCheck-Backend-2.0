#!/usr/bin/env python
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from sklearn.cluster import MiniBatchKMeans
import numpy as np
import json

# Load env
load_dotenv()

# 1. Initialize Pinecone client
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)

index_name = os.getenv("PINECONE_INDEX_NAME")
index = pc.Index(index_name)

# Embedding model
#model = SentenceTransformer("all-MiniLM-L6-v2")
MODEL_PATH = os.getenv("SENTENCE_MODEL_PATH") or "all-MiniLM-L6-v2"

# -----------------------
# Utility functions
# -----------------------

try:
    model = SentenceTransformer(MODEL_PATH)
except Exception as e:
    print(f"[Warning] Could not load model '{MODEL_PATH}': {e}")
    model = None

def extract_text(path):
    ext = path.lower().split('.')[-1]
    if ext == 'json':
        return open(path, 'r', encoding='utf-8').read()
    raise ValueError(f"Unsupported type: {ext}")

def vectorize_text(text: str) -> list[float]:
    """Return embedding for given text"""
    return model.encode(text).tolist()

def process_and_upsert(path: str) -> str:
    """Vectorize and upsert document file into Pinecone"""
    #text = extract_text(path)
    #vector = vectorize_text(text)
    #doc_id = os.path.splitext(os.path.basename(path))[0]
    #index.upsert(vectors=[(doc_id, vector, {"file_name": os.path.basename(path)})])
    #return doc_id
    if not model:
        raise RuntimeError("Embedding model not loaded.")

    if not os.path.isfile(path):
        raise FileNotFoundError(f"File not found: {path}")

    ext = path.lower().split('.')[-1]
    text = ""
    if ext == 'json':
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    vector = model.encode(text).tolist()
    doc_id = os.path.splitext(os.path.basename(path))[0]

    # Upsert to Pinecone
    index.upsert(vectors=[(doc_id, vector, {"file_name": os.path.basename(path)})])
    return {"doc_id": doc_id, "file_name": os.path.basename(path)}

def retrieve_similar(query_text: str, top_k: int = 5):
    """Return top-k similar vectors from Pinecone"""
    query_vector = vectorize_text(query_text)
    results = index.query(vector=query_vector, top_k=top_k, include_values=False, include_metadata=True)
    return [{"vector_id": match.id, "score": match.score, "metadata": match.metadata} for match in results.matches]

def cluster_documents(n_clusters: int = 5):
    """Cluster all vectors and return vector_id -> cluster mapping"""
    # Fetch all vectors
    all_vectors = index.fetch(index.list_ids())
    vectors = []
    vector_ids = []
    for vid, item in all_vectors.items():
        vector_ids.append(vid)
        vectors.append(item.vector)
    
    if not vectors:
        return {}
    
    X = np.array(vectors)
    kmeans = MiniBatchKMeans(n_clusters=n_clusters, random_state=42, batch_size=32)
    labels = kmeans.fit_predict(X)
    return dict(zip(vector_ids, labels.tolist()))
