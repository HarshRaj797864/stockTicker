import prisma from "../db/db.js";
import { InvalidNumberError, NotFoundError } from "../middleware/errorHandler.js";

const getAllStocks = async (req, res, next) => {
    try {
        const {page: rawPage, limit: rawLimit} = req.query;
        if (rawPage !== undefined && (isNaN(Number(rawPage)) || Number(rawPage) <= 0)) {
            return next(new InvalidNumberError("Invalid pagination values"));
        }
        if (rawLimit !== undefined && (isNaN(Number(rawLimit)) || Number(rawLimit) <= 0)) {
            return next(new InvalidNumberError("Invalid pagination values"));
        }
        const page = Number(rawPage) || 1;
        const limit = Number(rawLimit) || 20;
        
        const skip = (page - 1)* limit;
        const [stocks, totalCount] = await Promise.all([
            prisma.stock.findMany({skip, take: limit, orderBy: {symbol: 'asc'}}),
            prisma.stock.count(),
        ]); 
        res.status(200).json({
            data: stocks,
            meta: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (e) {
        next(e);
    }
    
};

const getStockByTicker = async (req, res, next) => {
    try {
        const {ticker} = req.params;
    const stock = await prisma.stock.findUnique({
        where: {
            symbol: ticker
        }
    });
    
    if(stock === null) return next(new NotFoundError('Stock Not Found'));
    res.status(200).json(stock);
    } catch(e) {
        next(e);
    }
    
    
    
};

export {getAllStocks, getStockByTicker};
