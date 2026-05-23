import "dotenv/config";
import authApp from "./app.js";

const PORT = process.env.AUTH_PORT || 11000;

const httpServer = authApp.listen(PORT, "0.0.0.0", () => {
  console.log(`Auth service running on ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`[auth] ${signal} received, shutting down`);
  httpServer.close(() => process.exit(0));
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
