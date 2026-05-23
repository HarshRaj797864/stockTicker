# Architecture

StockTicker is a multi-service application: a stateless HTTP API, an isolated authentication service, a standalone market-data worker, and a one-shot database migrator, coordinated by Docker Compose and connected by Redis Pub/Sub.

## Service Topology

```
┌──────────────┐                                  ┌──────────────────┐
│   Frontend   │  ◀───── Socket.io (WebSocket) ───│                  │
│  (React +    │                                  │   Main API       │
│   Vite)      │  ──────── REST /api/* ──────────▶│  (Express +      │
└──────────────┘                                  │   Socket.io)     │
                                                  └────┬────────▲────┘
                                                       │        │
                                          Prisma write │        │ PSUBSCRIBE
                                                       ▼        │ market:prices:*
                                                  ┌──────────────────┐
                                                  │    Postgres      │
                                                  │  (shared DB)     │
                                                  └──────────────────┘
                                                       ▲
                                          Prisma write │
                                                       │
                                                  ┌────┴─────────────┐         ┌──────────┐
                                                  │  Market Data     │ PUBLISH │  Redis   │
                                                  │  Worker          │────────▶│ Pub/Sub  │
                                                  │  (Node poller)   │         └─────┬────┘
                                                  └──────────────────┘               │
                                                                                     │
                                                                                     ▼
                                                                          (API subscriber above)
```

## Services

### Auth Service (`server/auth-service/`, container `auth`)
- Separate Express process on port `11000`. Boots from `auth-service/server.js`.
- Owns: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`, `/api/health`.
- Issues JWTs signed with the shared `JWT_SECRET`.
- Has no other responsibilities — it does not serve stocks, watchlists, or sockets.
- The browser hits this service directly via the `authApi` axios instance (`VITE_AUTH_URL`).

### Main API (`server/`, container `api`)
- Express 5 + Socket.io 4 sharing one HTTP server on port `10000`.
- Routes: `/api/stocks/*`, `/api/watchlists/*`, `/api/health`. **Does not** serve `/api/auth/*` — those return 404 here by design.
- Validates JWTs issued by the Auth Service using the shared `JWT_SECRET` via the existing `isAuthenticated` middleware.
- On startup, opens a Redis `PSUBSCRIBE` on `market:prices:*` and forwards every payload to the Socket.io room `prices:<symbol>`.
- Stateless. Killing it does not interrupt market-data ingestion or auth.

### Market Data Worker (`server/worker/index.js`, container `worker`)
- Separate Node.js process. No HTTP listener.
- Polls a configurable ticker list every `POLL_INTERVAL_MS` (default 10s).
- Fetches quotes (Finnhub when `FINNHUB_API_KEY` is set, otherwise deterministic mock data).
- Upserts to Postgres via Prisma, then `PUBLISH`es one Redis message per ticker on `market:prices:<symbol>`.
- Killing the worker does not interrupt the API; restart resumes polling without manual intervention.

### Migrator (container `migrator`, builds from Dockerfile `target: builder`)
- One-shot container that runs `prisma migrate deploy` and exits.
- API depends on `migrator: service_completed_successfully` so the schema is always current before the API accepts traffic.
- Builds from the `builder` stage because the slim runtime image deliberately omits the Prisma CLI.

### Postgres (`postgres:16.2-alpine`)
- Shared by API and Worker (shared-database microservices pattern).
- Healthchecked via `pg_isready`.
- Internal-only port in `docker-compose.yml`; exposed on host `5433` in `docker-compose.override.yml` for local GUI access.

### Redis (`redis:7.2-alpine`)
- Pub/Sub channel `market:prices:<symbol>` is the only inter-service messaging surface.
- Healthchecked via `redis-cli ping`.
- Internal-only port in `docker-compose.yml`; exposed on host `6380` in `docker-compose.override.yml`.

## Data Flow

**Live price update path** (every poll cycle):

1. Worker calls `syncMarketData(TICKERS, { onUpdate })`.
2. For each ticker, `fetchQuote` returns `{ currentPrice, initialPrice }` (mock or Finnhub).
3. Prisma `upsert` writes the row.
4. `onUpdate(stock)` calls `publisher.publish("market:prices:" + symbol, JSON.stringify(payload))`.
5. API's PSUBSCRIBE receives the message.
6. API extracts the symbol from the channel name, looks up the Socket.io room `prices:<symbol>`, and `io.to(room).emit("price", payload)`.
7. Each browser tab subscribed to that symbol receives the event in its `useLivePrice` hook and re-renders.

**REST path** (unchanged from the monolith):

- Auth, watchlist CRUD, and stock-search queries continue to hit the Main API directly. No worker involvement, no Pub/Sub.

## Key Design Choices

### Why split Auth into its own service?
- Failure isolation: a bug in the auth flow can't take down stock/watchlist endpoints.
- Bounded scope keeps the surface easy to audit — auth code lives behind one port, with one purpose.
- Shared `JWT_SECRET` is the only coupling between Auth and Main API; that's a contract, not a runtime dependency. Main API doesn't proxy or call Auth at request time, it just verifies signatures.
- The split is honest microservice separation (two processes, two ports) rather than a reverse-proxy pretending to be one — recruiters can see both running.

### Why a separate Worker process (not a setInterval inside the API)?
- Polling work cannot stall the API's request thread. A slow Finnhub call doesn't lengthen p95 on `/api/watchlists`.
- The Worker can be scaled or rescheduled independently.
- Failure isolation: a Worker crash doesn't take down the user-facing API.

### Why two separate Redis connections in `server/lib/redis.js`?
ioredis (and the Redis protocol) put a client into a one-way subscribe mode once `SUBSCRIBE`/`PSUBSCRIBE` is issued. A subscribed client can no longer issue regular commands. The Main API needs to both publish (in future sprints) and subscribe, so it holds two connections via `getPublisher()` / `getSubscriber()`.

### Why a single shared Postgres (not DB-per-service)?
DB-per-service is the textbook microservices pattern but introduces saga complexity, cross-DB FK loss, and a much heavier ops surface. Most production "microservice" deployments use shared persistence with bounded contexts at the code level. Auth, market-data, and portfolio domains share one schema but never reach into each other's tables.

### Why Pub/Sub (not BullMQ or Kafka)?
Pub/Sub is fire-and-forget, which is correct for live price updates: a missed message is fine because the next tick replaces it. BullMQ is the right answer when you need durability, retries, and at-least-once delivery (e.g., placing an order). Kafka is right when you need replay and ordering across consumer groups. Neither is required here.

### Why a separate `migrator` service (not run-on-startup in the API)?
- API startup stays fast and deterministic.
- Runtime image stays slim — it doesn't ship the Prisma CLI.
- Compose's `service_completed_successfully` gives a clean ordering primitive.

## Local Development

```
git clone <repo>
cd stockTicker
docker compose up --build
# API:      http://localhost:10000
# Postgres: localhost:5433 (via override)
# Redis:    localhost:6380 (via override)

# Frontend (separate terminal):
cd client && npm install && npm run dev
# Open http://localhost:5173
```

## Configuration

| Env var | Default | Owner |
|---|---|---|
| `POSTGRES_PASSWORD` | `stockpass` | postgres |
| `DATABASE_URL`, `DIRECT_URL` | composed from POSTGRES_PASSWORD | api, worker, migrator |
| `REDIS_URL` | `redis://redis:6379` | api, worker |
| `JWT_SECRET` | `dev-secret-change-me` | api |
| `FRONTEND_URL` | `http://localhost:5173` | api (CORS allowlist) |
| `FINNHUB_API_KEY` | empty | worker |
| `MOCK_PRICES` | `true` | worker (deterministic mock if no Finnhub key) |
| `POLL_INTERVAL_MS` | `10000` | worker |
| `WORKER_TICKERS` | `AAPL,MSFT,GOOGL,AMZN,TSLA,NVDA,META` | worker |
