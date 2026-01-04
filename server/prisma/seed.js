import prisma from '../db/db.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Manual Seed...');

    // 1. CLEANUP: Clear old data to prevent conflicts
    console.log('🧹 Cleaning up old data...');
    // Delete in correct order (Child -> Parent)
    await prisma.watchlistStock.deleteMany({});
    await prisma.stock.deleteMany({}); 

    // 2. INSERT STATIC DATA (Guaranteed to work)
    console.log('📝 Inserting static stock data...');
    
    const count = await prisma.stock.createMany({
        data: [
            { symbol: 'AAPL', companyName: 'Apple Inc.', currentPrice: 180.50, initialPrice: 175.00 },
            { symbol: 'TSLA', companyName: 'Tesla Inc.', currentPrice: 240.10, initialPrice: 230.00 },
            { symbol: 'GOOGL', companyName: 'Alphabet Inc.', currentPrice: 140.20, initialPrice: 138.00 },
            { symbol: 'MSFT', companyName: 'Microsoft Corp.', currentPrice: 400.00, initialPrice: 390.00 },
            { symbol: 'AMZN', companyName: 'Amazon.com Inc.', currentPrice: 175.30, initialPrice: 170.00 },
            { symbol: 'NFLX', companyName: 'Netflix Inc.', currentPrice: 600.50, initialPrice: 590.00 },
            { symbol: 'NVDA', companyName: 'NVIDIA Corp.', currentPrice: 850.00, initialPrice: 800.00 },
        ]
    });

    console.log(`✅ SUCCESS: Manually inserted ${count.count} stocks.`);

  } catch (e) {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
