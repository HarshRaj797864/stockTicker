import prisma from "../db/db.js";
import { ValidationError } from "../middleware/errorHandler.js";
import bcrypt from "bcryptjs";

export const createUser = async ({ email, password, name }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new ValidationError("Duplicate Email");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
  const {password:_, ...sanitizedUser} = user;
  return sanitizedUser;
};
