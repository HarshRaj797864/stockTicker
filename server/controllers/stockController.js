import prisma from "../db/db.js";
import { NotFoundError } from "../middleware/errorHandler.js";

const getAllStocks = async (req, res, next) => {
    try {
        const stocks = await prisma.stock.findMany(); 
        res.status(200).json(stocks);
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
    
    if(stock === null) next(new NotFoundError('Stock Not Found'));
    res.status(200).json(stock);
    } catch(e) {
        next(e);
    }
    
    
    
};

export {getAllStocks, getStockByTicker};
