import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../db/db.js";
import jwt from "jsonwebtoken";

describe("POST /api/auth/signup", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });
  it("should register a new user and verify database state", async () => {
    const signupData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };
    const res = await request(app).post("/api/auth/signup").send(signupData);

    expect(res.status).toEqual(201);
    expect(res.body.user.email).toEqual(signupData.email);
    // never return passwords for security
    expect(res.body.user.password).toBeUndefined();

    const dbUser = await prisma.user.findUnique({
      where: { email: signupData.email },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser.email).toBe(signupData.email);
    expect(dbUser.password).not.toBe(signupData.password);
    expect(dbUser.password.length).toBeGreaterThan(20);
  });
  it("should fail if email is already taken (Constraint Test)", async () => {
    // seeding a user
    await prisma.user.create({
      data: {
        email: "duplicate@example.com",
        password: "hashed_password",
        name: "Duplicate test user",
      },
    });

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "duplicate@example.com",
        password: "newpassword123",
        name: "new User",
      });

    expect(res.status).toBe(409);
  });
  it("should reject a password shorter than 6 characters", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "short@example.com",
      password: "123",
      name: "Short Password User",
    });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/password/i);
    const dbUser = await prisma.user.findUnique({
      where: { email: "short@example.com" },
    });
    expect(dbUser).toBeNull();
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/signup").send({
      email: "login@example.com",
      password: "password123",
      name: "Login User",
    });
  });
  it("should login with valid credentials and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    const decoded = jwt.decode(res.body.token);
    expect(decoded.email).toBe("login@example.com");
    expect(decoded).toHaveProperty("userId");
  });
  it("should prevent authorization for incorrect password",async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123!!!"
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/unauthorized/i);
  });
  it("should prevent authorization for incorrect email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "loginFake@example.com",
      password: "password123"
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/unauthorized/i);
  });
});
