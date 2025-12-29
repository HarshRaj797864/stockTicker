import { findAllStocks, findStockByTicker } from "../services/stockService.js";
import { InvalidNumberError } from "../middleware/errorHandler.js";
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

  const result = await findAllStocks({page, limit});
  res.status(200).json(result);
});

const getStockByTicker = asyncHandler(async (req, res, next) => {
  const { ticker } = req.params;
  const stock = await findStockByTicker(ticker);
  res.status(200).json(stock);
});

export { getAllStocks, getStockByTicker };
