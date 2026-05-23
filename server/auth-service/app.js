import express from "express";
import cors from "cors";
import { authRouter } from "../routes/auth.js";
import { NotFoundError, errorHandler } from "../middleware/errorHandler.js";
import { latencyLogger } from "../middleware/latency.js";

const authApp = express();

authApp.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://stock-ticker-eta.vercel.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

authApp.use(express.json());
authApp.use(latencyLogger);

authApp.get("/api/health", (_req, res) => res.json({ ok: true, service: "auth" }));
authApp.use("/api/auth", authRouter);

authApp.use((_req, _res, next) => {
  next(new NotFoundError("Not Found"));
});

authApp.use(errorHandler);

export default authApp;
