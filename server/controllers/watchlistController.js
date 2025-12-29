import { asyncHandler } from "../utils/asyncHandler.js";
import { createWatchlist, getUserWatchlists } from "../services/watchlistService.js";
import { InvalidNumberError } from "../middleware/errorHandler.js";

export const create = asyncHandler(async (req, res, next) => {
    const {name} = req.body;
    const userId = Number(req.user.userId);
    if (isNaN(userId)) {
        return next(new InvalidNumberError("Invalid user ID"));
    }
    const watchlist = await createWatchlist({userId, name});
    res.status(201).json(watchlist);
});

export const getAll = asyncHandler(async (req, res, next) => {
    const userId = Number(req.user.userId);
    const watchLists = await getUserWatchlists({userId});
    res.status(200).json(watchLists);
});
