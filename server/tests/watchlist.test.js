import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../db/db.js";

const getAuthToken = async (email) => {
  const signup = await request(app)
    .post("/api/auth/signup")
    .send({ email, password: "password123", name: "Test" });
    
  if (signup.status !== 201 && signup.status !== 409) {
     throw new Error(`Signup failed in test setup: ${signup.body.error}`);
  }

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password123" });
    
  return res.body.token;
};

describe("Watchlist API", () => {
  let tokenA;
  let tokenB;

  beforeEach(async () => {
    await prisma.watchlistStock.deleteMany();
    await prisma.watchlist.deleteMany();
    await prisma.user.deleteMany();

    tokenA = await getAuthToken("userA@test.com");
    tokenB = await getAuthToken("userB@test.com");
  });

  it.skip("should create a watchlist for the authenticated user", async () => {
    const res = await request(app)
      .post("/api/watchlists")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "My First List" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("My First List");
    expect(res.body).toHaveProperty("userId");
  });

  it("should list ONLY the user's watchlists (Data Isolation)", async () => {
    await request(app)
      .post("/api/watchlists")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "User A List" });

    const resB = await request(app)
      .get("/api/watchlists")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(resB.status).toBe(200);
    expect(resB.body).toHaveLength(0);
  });
});

describe("POST /api/watchlists/:id/stocks", () => {
  let listId;
  let token;

  beforeEach(async () => {
    token = await getAuthToken("trader@test.com");

    const listRes = await request(app)
      .post("/api/watchlists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Tech Picks" });
    listId = listRes.body.id;

    await prisma.stock.upsert({
      where: { symbol: "AAPL" },
      update: {},
      create: {
        symbol: "AAPL",
        companyName: "Apple",
        currentPrice: 150,
        initialPrice: 100,
      },
    });
  });

  it("should add a stock to the user's watchlist", async () => {
    const res = await request(app)
      .post(`/api/watchlists/${listId}/stocks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ticker: "AAPL" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.stockId).toBeDefined();
  });

  it("should fail if stock ticker does not exist", async () => {
    const res = await request(app)
      .post(`/api/watchlists/${listId}/stocks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ticker: "FAKE" });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Stock.*not found/i);
  });

  it("should fail if user tries to modify someone else's list", async () => {
    const hackerToken = await getAuthToken("hacker@test.com");

    const res = await request(app)
      .post(`/api/watchlists/${listId}/stocks`)
      .set("Authorization", `Bearer ${hackerToken}`)
      .send({ ticker: "AAPL" });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Watchlist not found/i);
  });

  it("should fail if stock is already in the list", async () => {
    await request(app)
      .post(`/api/watchlists/${listId}/stocks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ticker: "AAPL" });

    const res = await request(app)
      .post(`/api/watchlists/${listId}/stocks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ticker: "AAPL" });

    expect(res.status).toBe(409);
  });
});
