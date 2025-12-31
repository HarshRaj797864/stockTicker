import {Router} from "express";
import {getAllStocks, getStockByTicker, createStock} from "../controllers/stockController.js";

const stocksRouter = Router();
stocksRouter.get("/", getAllStocks);
stocksRouter.post("/", createStock);
stocksRouter.get("/:ticker", getStockByTicker);

export {stocksRouter};
