import prisma from "../db/db.js";
import axios from "axios";
import { NotFoundError, ConflictError } from "../middleware/errorHandler.js";

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

export const createNewStock = async ({
  symbol,
  companyName,
  currentPrice,
  initialPrice,
}) => {
  const existingStock = await prisma.stock.findUnique({
    where: { symbol },
  });

  if (existingStock) {
    throw new ConflictError(`Stock symbol '${symbol}' already exists`);
  }

  const stock = await prisma.stock.create({
    data: { symbol, companyName, currentPrice, initialPrice },
  });

  return stock;
};

export const syncMarketData = async (tickers) => {
  console.log(`Syncing data via Finnhub for: ${tickers.join(", ")}`);

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    throw new Error("Missing FINNHUB_API_KEY in environment variables");
  }

  const updates = tickers.map(async (symbol) => {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: symbol,
          token: apiKey,
        },
      });

      const { c: currentPrice, pc: initialPrice } = response.data;

      if (currentPrice === 0) {
        console.warn(`Invalid symbol or no data for: ${symbol}`);
        return null;
      }

      return prisma.stock.upsert({
        where: { symbol: symbol },
        update: {
          currentPrice: Number(currentPrice),
          initialPrice: Number(initialPrice),
        },
        create: {
          symbol: symbol,
          companyName: symbol,
          currentPrice: Number(currentPrice),
          initialPrice: Number(initialPrice),
        },
      });
    } catch (error) {
      console.error(`Failed to fetch ${symbol}:`, error.message);
      return null;
    }
  });

  await Promise.all(updates);

  return await prisma.stock.findMany({
    orderBy: { symbol: "asc" },
    take: 20,
  });
};

// database does not have access to last 30 days of data for chart hence using Finnhub API for it
export const fetchStockHistory = async (symbol, resolution = "D") => {
  const apiKey = process.env.FINNHUB_API_KEY;

  const to = Math.floor(Date.now() / 1000);
  const from = to - 30 * 24 * 60 * 60;

  try {
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.s === "ok") {
      return data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toLocaleDateString(),
        price: data.c[index],
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Failed to fetch history for ${symbol}:`, error.message);
    throw new Error("External API Error");
  }
};
