import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app.js";
import { getSubscriber, channels } from "./lib/redis.js";

const PORT = process.env.PORT || 10000;

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://stock-ticker-eta.vercel.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  },
});

const roomFor = (symbol) => `prices:${symbol.toUpperCase()}`;

io.on("connection", (socket) => {
  console.log(`[socket] connect ${socket.id}`);

  socket.on("subscribe", ({ symbol } = {}) => {
    if (typeof symbol !== "string" || !symbol.trim()) return;
    socket.join(roomFor(symbol));
  });

  socket.on("unsubscribe", ({ symbol } = {}) => {
    if (typeof symbol !== "string" || !symbol.trim()) return;
    socket.leave(roomFor(symbol));
  });

  socket.on("disconnect", () => {
    console.log(`[socket] disconnect ${socket.id}`);
  });
});

async function bootSubscriber() {
  const subscriber = getSubscriber();
  await subscriber.psubscribe(channels.pricePattern);
  subscriber.on("pmessage", (_pattern, channel, message) => {
    const symbol = channel.split(":")[2];
    if (!symbol) return;
    try {
      const payload = JSON.parse(message);
      io.to(roomFor(symbol)).emit("price", payload);
    } catch (err) {
      console.error(`[socket] bad payload on ${channel}: ${err.message}`);
    }
  });
  console.log(`[socket] subscribed to ${channels.pricePattern}`);
}

bootSubscriber().catch((err) => {
  console.error("[socket] subscriber boot failed:", err);
  process.exit(1);
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`[server] ${signal} received, shutting down`);
  io.close();
  httpServer.close(() => process.exit(0));
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
