import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../db/db.js";

const getAuthToken = async (email) => {
  await request(app)
    .post("/api/auth/signup")
    .send({ email, password: "password123", name: "Test" });
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

  it("should create a watchlist for the authenticated user", async () => {
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
