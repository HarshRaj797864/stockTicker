import {
  findAllStocks,
  findStockByTicker,
  createNewStock,
  syncMarketData,
} from "../services/stockService.js";
import { ConflictError, InvalidNumberError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllStocks = asyncHandler(async (req, res, next) => {
  const { page: rawPage, limit: rawLimit } = req.query;
  if (
    rawPage !== undefined &&
    (isNaN(Number(rawPage)) || Number(rawPage) <= 0)
  ) {
    return next(new InvalidNumberError("Invalid pagination values"));
  }
  if (
    rawLimit !== undefined &&
    (isNaN(Number(rawLimit)) || Number(rawLimit) <= 0)
  ) {
    return next(new InvalidNumberError("Invalid pagination values"));
  }
  const page = Number(rawPage) || 1;
  const limit = Number(rawLimit) || 20;

  const result = await findAllStocks({ page, limit });
  res.status(200).json(result);
});

const getStockByTicker = asyncHandler(async (req, res, next) => {
  const { ticker } = req.params;
  const stock = await findStockByTicker(ticker);
  res.status(200).json(stock);
});

const createStock = asyncHandler(async (req, res, next) => {
  const { symbol, companyName, currentPrice, initialPrice } = req.body;

  if (!symbol || !companyName || !currentPrice) {
    next(new ConflictError("Missing required fields"));
  }

  const stock = await createNewStock({
    symbol,
    companyName,
    currentPrice: Number(currentPrice),
    initialPrice: Number(initialPrice),
  });

  res.status(201).json(stock);
});

export const triggerSync = asyncHandler(async (req, res) => {
  const tickers = req.body?.tickers || ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META"];

  
  const updatedStocks = await syncMarketData(tickers);
  
  res.status(200).json({
    message: "Market data synced successfully",
    count: updatedStocks.length,
    data: updatedStocks
  });
});


export { getAllStocks, getStockByTicker, createStock };
