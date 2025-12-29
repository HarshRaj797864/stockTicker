import prisma from "../db/db.js";
import { NotFoundError } from "../middleware/errorHandler.js";

const getAllStocks = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
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
