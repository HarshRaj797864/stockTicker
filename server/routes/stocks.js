import {Router} from "express";
import {getAllStocks, getStockByTicker, createStock, triggerSync} from "../controllers/stockController.js";

const stocksRouter = Router();
stocksRouter.get("/", getAllStocks);
stocksRouter.post("/sync", triggerSync);
stocksRouter.post("/", createStock);
stocksRouter.get("/:ticker", getStockByTicker);

export {stocksRouter};
