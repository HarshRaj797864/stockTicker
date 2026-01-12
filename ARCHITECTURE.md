# ARCHITECTURE.md - The Algo-Trading Microservices System

## 1. High-Level System Overview

This project transitions from a Monolithic PERN application to a **Event-Driven, Polyglot Microservices Architecture**. It combines high-performance Node.js I/O with Python's quantitative capabilities.

### Service Mesh

* **Service A (The Gateway):** Node.js/Express. Handles Auth, REST API, WebSocket (User Facing).
* **Service B (The Worker):** Node.js Background Worker. Handles Backtesting logic & Number crunching.
* **Service C (The Lab):** Python Offline Trainer. Trains RL agents on historical data (Batch Jobs).
* **Service D (The Oracle):** Python FastAPI. Serves Real-time ML predictions (Inference).
* **Service E (The Analyst):** Python/LangChain. Performs RAG-based Sentiment Analysis on News.

---

## Phase 1: Advanced Backend Engineering (Weeks 1-2)

**Goal:** Data Integrity & Asynchronous Processing.
**Tech Stack:** Node.js, TypeScript, PostgreSQL, Redis, BullMQ.

### 1.1 The "God Mode" Database Schema

We move from generic types to Financial-Grade data structures.

* **Action:** Create a migration for the `market_data` table.
* **Critical Specs:**
* **Price:** `NUMERIC(15, 6)` (Never use Float/Double for money).
* **Time:** `TIMESTAMPTZ` (Timezone aware is mandatory for global markets).
* **Constraints:** Composite Primary Key `(symbol, timestamp)`.


* **Performance Optimization:**
* Create a **Composite B-Tree Index** on `(symbol, timestamp DESC)`.
* *Why:* This enables  range scans for "Get me AAPL data from 2020 to 2023" used in backtesting.



### 1.2 Event-Driven Architecture (The Queue)

We decouple the "Backtest" button from the API response to prevent blocking the Event Loop.

* **Library:** `bullmq` (built on Redis Streams).
* **Flow:**
1. User clicks "Run Strategy".
2. **Service A** pushes payload `{ strategyId, symbol, dateRange }` to Redis `job_queue`.
3. **Service A** immediately returns `202 Accepted` to the frontend.
4. **Service B** (Worker) detects the job, fetches data from Postgres, runs the loop, and writes results to `backtest_results` table.
5. **WebSocket** notifies the user when finished.



---

## Phase 2: Infrastructure & DevOps (Weeks 3-4)

**Goal:** Production-Ready Environment.
**Tech Stack:** Docker, Nginx, AWS EC2, Linux.

### 2.1 Containerization Strategy

* **Multi-Stage Builds:** Use `node:20-alpine` as the base.
* *Stage 1 (Builder):* Install all dependencies (including `devDependencies`), compile TypeScript to JS.
* *Stage 2 (Runner):* Copy only `dist/` and `package.json`. Install only `production` deps.
* *Result:* Image size drops from ~1GB to ~150MB.


* **Networking:** Define a custom bridge network `trading-net` in `docker-compose.yml` so services resolve by name (e.g., `postgres:5432`).

### 2.2 Cloud Deployment (AWS)

* **Compute:** AWS EC2 t2.micro (Ubuntu 24.04).
* **Gateway (Nginx):**
* Run Nginx *outside* Docker (on the host) or as a container.
* **Reverse Proxy:** Route port 80 -> `localhost:3000`.
* **Security:** Rate Limit requests to 10 req/sec to prevent DDoS.


* **Firewall (Security Groups):** Allow ONLY 22 (SSH), 80 (HTTP), 443 (HTTPS). **Block** 3000, 5432, 6379 from the public internet.

---

## Phase 3: The Offline RL Pipeline (Weeks 5-6)

**Goal:** Reinforcement Learning Environment (BTP Integration).
**Tech Stack:** Python, Gymnasium (OpenAI), Stable-Baselines3, Pandas.

### 3.1 The "Gym" Environment

* **Task:** Create a custom class `TradingEnv` inheriting from `gymnasium.Env`.
* **Observation Space:** A normalized vector of `[Close Price, RSI, MACD, Volume, PositionStatus]`.
* **Action Space:** Discrete `{0: HOLD, 1: BUY, 2: SELL}`.
* **Reward Function:** `(CurrentPortfolioValue - PreviousPortfolioValue) - TransactionCosts`.

### 3.2 The Training Loop (Service C)

* **Workflow:**
1. Script connects to the Postgres Container to fetch 5 years of `market_data`.
2. Trains a **PPO (Proximal Policy Optimization)** agent.
3. **Artifact Generation:** Saves the trained "brain" as `model_v1.zip` to a shared volume `/models`.



---

## Phase 4: The ML Integration (Weeks 7-8)

**Goal:** Real-time Inference Microservice.
**Tech Stack:** Python, FastAPI, Pydantic, Uvicorn.

### 4.1 Service D (The Oracle)

* **Role:** Exposes the trained model via HTTP.
* **Endpoint:** `POST /predict`
* **Contract:**
```json
// Request
{ "state": [150.2, 65.5, 0.02, 1200000, 1] } 
// Response
{ "action": 1, "confidence": 0.88 }

```


* **Logic:**
1. On startup (`@app.on_event("startup")`), load `model_v1.zip` into memory.
2. On request, run `model.predict(state)` and return JSON.



### 4.2 Inter-Service Communication

* **Node.js Integration:**
* Service A does *not* run the model.
* Service A calls Service D: `axios.post('http://ml-service:8000/predict', data)`.



---

## Phase 5: The GenAI "Edge" (Weeks 9-12)

**Goal:** Multi-Modal Sentiment Analysis (RAG).
**Tech Stack:** LangChain, OpenAI API (or Ollama), pgvector.

### 5.1 The Vector Database

* **Extension:** Enable `vector` extension in PostgreSQL.
* **Table:** `news_embeddings`
* Columns: `id`, `headline`, `url`, `embedding (vector[1536])`, `sentiment_score`.



### 5.2 The RAG Pipeline (Service E)

* **Ingestion:** Python script fetches financial news (e.g., NewsAPI).
* **Embedding:** Pass headlines to OpenAI `text-embedding-3-small` to get vectors.
* **Storage:** Save vectors to Postgres.
* **Retrieval:** When generating a trade signal, query:
* *"Select top 3 news items semantically related to 'Apple Crash' from last 24h".*


* **Synthesis:**
* LLM Prompt: *"Given these 3 headlines, output a sentiment score from -1.0 to 1.0."*
* **Fusion:** This score becomes an extra input feature for the RL Model in Phase 3 (Retraining required).



---

## Technology Stack Summary

| Component | Tech Choice | Why? |
| --- | --- | --- |
| **Language** | TypeScript (Node) & Python | Best of both worlds (IO vs Math). |
| **Database** | PostgreSQL | Reliability + Vector Search support. |
| **Cache/Queue** | Redis | Industry standard for async jobs. |
| **Container** | Docker | Dependency isolation. |
| **ML/RL** | PyTorch / Stable-Baselines3 | Standard for RL research. |
| **GenAI** | LangChain | Abstraction for LLM logic. |
| **API Spec** | OpenAPI (Swagger) | Auto-documentation. |

---
