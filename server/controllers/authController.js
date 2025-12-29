import { asyncHandler } from "../utils/asyncHandler.js";
import { ValidationError } from "../middleware/errorHandler.js";
import { createUser } from "../services/createUser.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email) return next(new ValidationError("No Email"));
  if (!password || password.trim().length < 6)
    return next(new ValidationError("Invalid password"));

  const user = await createUser({ email, password, name });
  res.status(201).json({ user });
});
