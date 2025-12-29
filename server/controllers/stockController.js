import prisma from "../db/db.js";
import {
  InvalidNumberError,
  NotFoundError,
} from "../middleware/errorHandler.js";
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

  const skip = (page - 1) * limit;
  // Promise.all has transaction nature and also to reduce waiting time
  const [stocks, totalCount] = await Promise.all([
    prisma.stock.findMany({ skip, take: limit, orderBy: { symbol: "asc" } }),
    prisma.stock.count(),
  ]);
  res.status(200).json({
    data: stocks,
    meta: {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
});

const getStockByTicker = asyncHandler(async (req, res, next) => {
  const { ticker } = req.params;
  const stock = await prisma.stock.findUnique({
    where: {
      symbol: ticker,
    },
  });

  if (stock === null) return next(new NotFoundError("Stock Not Found"));
  res.status(200).json(stock);
});

export { getAllStocks, getStockByTicker };
