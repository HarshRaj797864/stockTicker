import {Router} from "express";
import {getAllStocks, getStockByTicker} from "../controllers/stockController.js";

const stocksRouter = Router();
stocksRouter.get("/", getAllStocks);
stocksRouter.get("/:ticker", getStockByTicker);

export {stocksRouter};
