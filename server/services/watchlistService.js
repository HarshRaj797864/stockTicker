import prisma from "../db/db.js";
import { NotFoundError, ConflictError } from "../middleware/errorHandler.js"; // Ensure you have these

export const createWatchlist = async ({ userId, name }) => {
  return await prisma.watchlist.create({
    data: { name, userId },
  });
};

export const getUserWatchlists = async ({ userId }) => {
  return await prisma.watchlist.findMany({
    where: { userId },
    include: {
      stocks: {
        include: {
          stock: true,
        },
      },
    },
  });
};

export const addStockToWatchlist = async ({ userId, watchlistId, symbol }) => {
  const watchlist = await prisma.watchlist.findUnique({
    where: { id: watchlistId },
  });

  if (!watchlist) {
    throw new NotFoundError("Watchlist not found");
  }
  if (watchlist.userId !== userId) {
    throw new Error("Unauthorized access to this watchlist");
  }

  const stock = await prisma.stock.findUnique({
    where: { symbol: symbol },
  });

  if (!stock) {
    throw new NotFoundError(
      `Stock '${symbol}' not found in database. Please sync market data first.`
    );
  }

  const existingEntry = await prisma.watchlistStock.findUnique({
    where: {
      watchlistId_stockId: {
        watchlistId: watchlistId,
        stockId: stock.id,
      },
    },
  });

  if (existingEntry) {
    throw new ConflictError("Stock is already in this watchlist");
  }

  return await prisma.watchlistStock.create({
    data: {
      watchlistId,
      stockId: stock.id,
    },
    include: {
      stock: true,
    },
  });
};
