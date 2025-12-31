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

  const to = 1706745600;
  const from = 1704067200;

  try {
    if (!apiKey) throw new Error("No API Key");

    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
    const response = await axios.get(url);

    if (response.data.s === "ok") {
      return response.data.t.map((t, i) => ({
        date: new Date(t * 1000).toLocaleDateString(),
        price: response.data.c[i],
      }));
    }
    // If we get here, API replied but said "no_data"
    console.warn(
      `⚠️ Finnhub returned no data (Status: ${response.data.s}). Switching to Mock.`
    );
    throw new Error("API No Data");
  } catch (error) {
    console.log(
      `⚠️ Serving MOCK history for ${symbol} due to error: ${error.message}`
    );

    // Generating a realistic-looking random walk chart
    const mockData = [];
    let price = 150.0;
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Random fluctuation between -2% and +2%
      const change = (Math.random() - 0.5) * 4;
      price = price + change;

      mockData.push({
        date: date.toLocaleDateString(),
        price: parseFloat(price.toFixed(2)),
      });
    }
    return mockData;
  }
};
