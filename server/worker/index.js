import "dotenv/config";
import { getPublisher, channels } from "../lib/redis.js";
import { syncMarketData } from "../services/stockService.js";

const TICKERS = (process.env.WORKER_TICKERS || "AAPL,MSFT,GOOGL,AMZN,TSLA,NVDA,META")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS) || 30000;

const publisher = getPublisher();

async function publishUpdate(stock) {
  const payload = JSON.stringify({
    symbol: stock.symbol,
    currentPrice: stock.currentPrice,
    initialPrice: stock.initialPrice,
    at: new Date().toISOString(),
  });
  await publisher.publish(channels.price(stock.symbol), payload);
  console.log(`[worker] published ${stock.symbol} @ ${stock.currentPrice}`);
}

async function tick() {
  try {
    await syncMarketData(TICKERS, { onUpdate: publishUpdate });
  } catch (err) {
    console.error("[worker] tick failed:", err.message);
  }
}

async function main() {
  console.log(`[worker] starting, tickers=${TICKERS.join(",")}, interval=${POLL_INTERVAL_MS}ms`);
  await tick();
  setInterval(tick, POLL_INTERVAL_MS);
}

main().catch((err) => {
  console.error("[worker] fatal:", err);
  process.exit(1);
});

const shutdown = async (signal) => {
  console.log(`[worker] ${signal} received, shutting down`);
  await publisher.quit().catch(() => {});
  process.exit(0);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
