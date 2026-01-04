import prisma from "../db/db.js";
import { syncMarketData } from "../services/stockService.js"; 

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting seed...");

    console.log("🧹 Cleaning up old data...");
    await prisma.watchlistStock.deleteMany({});
    await prisma.stock.deleteMany({});

    
    const tickers = [
      "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", 
      "NFLX", "AMD", "INTC", "IBM", "ORCL", "CRM", "ADBE",     
      "JPM", "BAC", "GS", "V", "MA", "PYPL",                   
      "WMT", "TGT", "COST", "KO", "PEP", "MCD", "SBUX",        
      "DIS", "NKE", "PFE"                                      
    ];

    if (process.env.FINNHUB_API_KEY) {
      console.log(`🌍 Fetching real market data for ${tickers.length} stocks...`);
      console.log("⏳ This may take a moment due to API limits...");
      
      
      await syncMarketData(tickers);
      
      console.log(`✅ Successfully seeded ${tickers.length} stocks with LIVE prices.`);
    } else {
      console.warn("⚠️ No FINNHUB_API_KEY found. Using fallback static data.");
      
    }
  } catch (e) {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
