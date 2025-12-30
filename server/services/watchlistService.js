import prisma from "../db/db.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../middleware/errorHandler.js";

export const createWatchlist = async ({ userId, name }) => {
  if (!name || !name.trim()) throw new ValidationError("Name is unavailable");
  const list = await prisma.watchlist.create({
    data: {
      name: name,
      userId: parseInt(userId),
    },
  });
  return list;
};

export const getUserWatchlists = async ({ userId }) => {
  const lists = await prisma.watchlist.findMany({ where: { userId } });
  return lists;
};

export const addStockToWatchlist = async ({ userId, watchlistId, symbol }) => {
  const stock = await prisma.stock.findUnique({ where: { symbol } });
  if (!stock) throw new NotFoundError("Stock not found");
  const { id: stockId } = stock;

  const foundlist = await prisma.watchlist.findFirst({
    where: { id: parseInt(watchlistId), userId: parseInt(userId) },
  });
  if (!foundlist) throw new NotFoundError("Watchlist not found");

  try {
    const watchlistStock = await prisma.watchlistStock.create({
      data: {
        watchlistId: parseInt(foundlist.id),
        stockId: parseInt(stockId),
      },
    });
    return watchlistStock;
  } catch (e) {
    // P2002 code is for Unique constraint violation
    if (e.code === "P2002")
      throw new ConflictError("Stock already in watchlist");
    throw e;
  }
};
