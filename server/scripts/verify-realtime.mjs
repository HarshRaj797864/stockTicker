import { io } from "socket.io-client";

const URL = process.env.API_URL || "http://localhost:10000";
const SYMBOLS = (process.env.SYMBOLS || "AAPL,TSLA").split(",");
const DURATION_MS = Number(process.env.DURATION_MS) || 15000;

const socket = io(URL, { transports: ["websocket"] });
const seen = Object.fromEntries(SYMBOLS.map((s) => [s, 0]));

socket.on("connect", () => {
  console.log(`[verify] connected ${socket.id}`);
  for (const symbol of SYMBOLS) {
    socket.emit("subscribe", { symbol });
    console.log(`[verify] subscribed to ${symbol}`);
  }
});

socket.on("price", (payload) => {
  seen[payload.symbol] = (seen[payload.symbol] || 0) + 1;
  console.log(`[verify] received ${payload.symbol} @ ${payload.currentPrice}`);
});

socket.on("connect_error", (err) => {
  console.error(`[verify] connect_error: ${err.message}`);
});

setTimeout(() => {
  console.log("[verify] summary:", seen);
  const total = Object.values(seen).reduce((a, b) => a + b, 0);
  socket.disconnect();
  process.exit(total > 0 ? 0 : 1);
}, DURATION_MS);
