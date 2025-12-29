import { describe, it, expect } from "vitest";
import prisma from "../db/db.js";

describe("Database Connection Sanity Check", () => {
  it("should successfully connect to the database", async () => {
    const result = await prisma.$queryRaw`SELECT 1`;
    expect(result).toBeDefined();
  });

  it("should be able to access the User table", async () => {
    const userCount = await prisma.user.count();
    expect(typeof userCount).toBe("number");
  });
});
