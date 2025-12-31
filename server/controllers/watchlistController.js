import {
  createWatchlist,
  getUserWatchlists,
  addStockToWatchlist,
  removeStockFromWatchlist,
  deleteWatchlist,
} from "../services/watchlistService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const parseId = (id) => {
  const parsed = parseInt(id);
  return isNaN(parsed) ? id : parsed;
};

export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;
  const watchlist = await createWatchlist({ userId, name });
  res.status(201).json(watchlist);
});

export const getAll = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const watchlists = await getUserWatchlists({ userId });
  res.status(200).json(watchlists);
});

export const addStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { ticker } = req.body;
  const userId = req.user.userId;

  const result = await addStockToWatchlist({
    userId,
    watchlistId: parseId(id),
    symbol: ticker,
  });

  res.status(201).json(result);
});

export const removeStock = asyncHandler(async (req, res) => {
  const { id, ticker } = req.params;
  const userId = req.user.userId;

  await removeStockFromWatchlist({
    userId,
    watchlistId: parseId(id),
    ticker,
  });

  res.status(200).json({ message: "Stock removed successfully" });
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  await deleteWatchlist({
    userId,
    watchlistId: parseId(id),
  });

  res.status(200).json({ message: "Watchlist deleted successfully" });
});
