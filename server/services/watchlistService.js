import prisma from "../db/db.js";
import { ValidationError } from "../middleware/errorHandler.js";

export const createWatchlist = async ({userId, name}) => {
    if(!name || !name.trim()) throw new ValidationError("Name is unavailable");
    const list = await prisma.watchlist.create({
        data: {
            name: name,
            userId: parseInt(userId),
        },
    });
    return list;
};

export const getUserWatchlists = async ({userId}) => {
    const lists = await prisma.watchlist.findMany({where: {userId}});
    return lists;
};
