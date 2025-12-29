import prisma from "../db/db.js";
import { NotFoundError } from "../middleware/errorHandler.js";

export const findAllStocks = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [stocks, totalCount] = await Promise.all([
    prisma.stock.findMany({ skip, take: limit, orderBy: { symbol: "asc" } }),
    prisma.stock.count(),
  ]);

  return {
    data: stocks,
    meta: {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const findStockByTicker = async (ticker) => {
  const stock = await prisma.stock.findUnique({ where: { symbol: ticker } });
  if (!stock) throw new NotFoundError("Stock Not Found");
  return stock;
};
