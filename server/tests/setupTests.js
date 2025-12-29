import { afterAll } from "vitest";
import prisma from "../db/db.js";

afterAll(async () => {
  await prisma.$disconnect();
});
