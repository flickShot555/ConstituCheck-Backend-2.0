# 📘 ConstituCheck Backend

**ConstituCheck** is an AI-powered legal narrative analysis platform designed to assess compliance with constitutional and international law frameworks.  
This repository contains the **backend services**, integrating **Node.js**, **Python**, **Pinecone**, **Firebase**, and **PostgreSQL** to deliver semantic search, document vectorization, and user-driven scenario processing.

---

## 🚀 Features

- **Cosine Similarity Search:** Retrieves the most relevant database vector using Pinecone.  
- **Document Vectorization:** Converts uploaded PDFs, DOCXs, and JSON files into embeddings via `sentence-transformers`.  
- **LLM Integration:** Sends user queries and relevant context to an LLM for interpretive analysis.  
- **Firebase Integration:** Manages user-specific data and access control.  
- **Scenario Tracking (SQL):** Stores and analyzes user query patterns for recommendation generation.  
- **Modular Design:** Separate services for Pinecone, Firebase, SQL, and Python modules for clarity and scalability.

---

## 🏗️ Project Structure

backend/
├── server.js
├── package.json
├── .env
│
├── routes/
│ ├── similarity.js
│ ├── vectorize.js
│ ├── user.js
│ └── scenario.js
│
├── services/
│ ├── llmService.js
│ ├── pineconeService.js
│ ├── firebaseService.js
│ ├── sqlService.js
│ ├── scenarioService.js
│ └── vectorService.js
│
├── db/
│ ├── connection.js
│ └── migrations/
│ └── create_scenarios_table.sql
│
├── python/
│ ├── vectorize_and_upsert.py
│ └── requirements.txt
│
└── utils/
└── helpers.js


---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | Node.js (Express) |
| **AI / Embeddings** | Python + SentenceTransformers |
| **Vector Database** | Pinecone |
| **User Data** | Firebase |
| **Scenario Data** | PostgreSQL (Render) |
| **Deployment** | Render Cloud |

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and include:

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
DATABASE_URL=postgres://user:password@host:port/dbname
FIREBASE_API_KEY=your_firebase_api_key
OPENAI_API_KEY=your_openai_api_key


> ⚠️ **Note:** Keep this file private and never commit it to GitHub.

---

## 🧰 Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-username/constituckeck-backend.git
cd backend

# 2️⃣ Install Node.js dependencies
npm install

# 3️⃣ Install Python dependencies
pip install -r python/requirements.txt

# 4️⃣ Run in development mode
npm run dev

## 🚢 Deployment (Render)

**Root directory:** `backend/`

**Build Command:**
```bash
pip install -r python/requirements.txt && npm install
```

Start Command: 
```bash
npm start
```

Add all environment variables in the Render dashboard.

## 📬 API Endpoints (Preview)

| Endpoint          | Method | Description                           |
| ----------------- | ------ | ------------------------------------- |
| `/api/vectorize`  | POST   | Upload and vectorize a new document   |
| `/api/similarity` | POST   | Search Pinecone for cosine similarity |
| `/api/user/:id`   | GET    | Fetch user info from Firebase         |
| `/api/scenario`   | POST   | Store or retrieve user scenario data  |

## 🧑‍💻 Authors

Warisha Shuaib           — COMSATS University Islamabad
Abbas Inayatullah  Khan  — COMSATS University Islamabad

(Final Year Project — December 2025)


## 🧾 License

This project is for academic and research purposes only and not for commercial distribution.