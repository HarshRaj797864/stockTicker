import prisma from '../db.js';
const seedDatabase = async () => {
    try{
        console.log('starting seed');
        // clearing the database to avoid uniqueness constraint error
        await prisma.stock.deleteMany({});
        console.log("Cleaned up existing stocks");

        // initial stock so to have a consistent starting point
        const inserted = await prisma.stock.createMany({
            data: [
                { symbol: 'AAPL', companyName: 'Apple', currentPrice: 180.50, initialPrice: 180.50 },
        { symbol: 'GOOGL', companyName: 'Google', currentPrice: 140.20, initialPrice: 140.20 },
        { symbol: 'TSLA', companyName: 'Tesla', currentPrice: 240.10, initialPrice: 240.10 },
            ],
        });
        console.log(`Successfully inserted ${inserted.count} stocks.`);
    } catch(e) {
        console.error("Seeding failed:", e);
        process.exit;
    } finally {
        await prisma.$disconnect();
    }
};


seedDatabase();
