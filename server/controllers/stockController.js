import prisma from "../db/db.js";
import { NotFoundError } from "../middleware/errorHandler.js";

const getAllStocks = async (req, res) => {
    const stocks = await prisma.stock.findMany(); 
    res.status(200).json(stocks);
    await prisma.$disconnect();
};

const getStockByTicker = async (req, res) => {
    const {ticker} = req.params;
    const stock = await prisma.stock.findUnique({
        where: {
            symbol: ticker
        }
    });
    await prisma.$disconnect();
    if(stock === null) throw new NotFoundError('Stock Not Found');
    res.status(200).json(stock);
    
};

export {getAllStocks, getStockByTicker};
