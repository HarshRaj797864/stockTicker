import { Router } from "express";
import {
  getAllStocks,
  getStockByTicker,
  createStock,
  triggerSync,
  getStockHistory,
} from "../controllers/stockController.js";

const stocksRouter = Router();
stocksRouter.get("/", getAllStocks);
stocksRouter.post("/sync", triggerSync);
stocksRouter.post("/", createStock);

stocksRouter.get("/:ticker/history", getStockHistory);
stocksRouter.get("/:ticker", getStockByTicker);

export { stocksRouter };
