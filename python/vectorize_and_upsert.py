#!/usr/bin/env python
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from sklearn.cluster import MiniBatchKMeans
import numpy as np
import json
import psycopg2
from uuid import uuid4

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

# PostgreSQL connection (adjust to your credentials)
conn = psycopg2.connect(
    dbname="your_db",
    user="your_user",
    password="your_password",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Ensure table exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    file_name TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
conn.commit()

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
    """Vectorize, upsert to Pinecone, and store original doc in PostgreSQL"""

    if not model:
        raise RuntimeError("Embedding model not loaded.")
    if not os.path.isfile(path):
        raise FileNotFoundError(f"File not found: {path}")

    ext = os.path.splitext(path)[-1].lower()
    if ext not in ['.json', '.txt']:
        raise ValueError(f"Unsupported file type: {ext}")

    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Handle JSON files by flattening or stringifying
    if ext == '.json':
        try:
            json_content = json.loads(text)
            text = json.dumps(json_content)
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON format")

    # Create a unique document ID
    doc_id = str(uuid4())

    # Generate vector embedding
    vector = model.encode(text).tolist()

    # Insert into PostgreSQL
    cursor.execute(
        "INSERT INTO documents (id, file_name, content) VALUES (%s, %s, %s)",
        (doc_id, os.path.basename(path), text)
    )
    conn.commit()

    # Upsert into Pinecone with reference metadata
    index.upsert(vectors=[
        (doc_id, vector, {"file_name": os.path.basename(path)})
    ])

    return {"doc_id": doc_id, "file_name": os.path.basename(path)}

def retrieve_similar(query_text: str, top_k: int = 5):
    """Return top-k similar vectors and their original documents"""
    query_vector = vectorize_text(query_text)
    results = index.query(vector=query_vector, top_k=top_k, include_metadata=True)

    response = []
    for match in results.matches:
        doc_id = match.id
        cursor.execute("SELECT file_name, content FROM documents WHERE id = %s", (doc_id,))
        record = cursor.fetchone()

        if record:
            file_name, content = record
            response.append({
                "vector_id": doc_id,
                "file_name": file_name,
                "score": match.score,
                "original_document": content
            })
        else:
            response.append({
                "vector_id": doc_id,
                "score": match.score,
                "error": "Document not found in PostgreSQL"
            })

    return response

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
