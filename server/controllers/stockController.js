import {
  findAllStocks,
  findStockByTicker,
  createNewStock,
  syncMarketData,
  fetchStockHistory,
} from "../services/stockService.js";
import {
  ConflictError,
  InvalidNumberError,
} from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllStocks = asyncHandler(async (req, res, next) => {
  const { page: rawPage = 1, limit: rawLimit = 20, search = "" } = req.query;
  const page = Number(rawPage);
  const limit = Number(rawLimit);

  if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
    return next(new InvalidNumberError("Invalid pagination values"));
  }

  const { stocks, total } = await findAllStocks({ page, limit, search });

  res.status(200).json({
    data: stocks,
    meta: {
      totalCount: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getStockByTicker = asyncHandler(async (req, res, next) => {
  const { ticker } = req.params;
  const stock = await findStockByTicker(ticker);
  res.status(200).json(stock);
});

const createStock = asyncHandler(async (req, res, next) => {
  const { symbol, companyName, currentPrice, initialPrice } = req.body;

  if (!symbol || !companyName || !currentPrice) {
    return next(new ConflictError("Missing required fields"));
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
  const tickers = req.body?.tickers || [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "NVDA",
    "META",
  ];

  const updatedStocks = await syncMarketData(tickers);

  res.status(200).json({
    message: "Market data synced successfully",
    count: updatedStocks ? updatedStocks.length : 0,
    data: updatedStocks,
  });
});

export const getStockHistory = asyncHandler(async (req, res) => {
  const { ticker } = req.params;
  const history = await fetchStockHistory(ticker);
  res.status(200).json(history);
});

export { getAllStocks, getStockByTicker, createStock };
