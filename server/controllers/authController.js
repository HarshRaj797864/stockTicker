import { asyncHandler } from "../utils/asyncHandler";
import { ValidationError } from "../middleware/errorHandler";
import { createUser } from "../services/createUser";

export const signUp = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email) next(new ValidationError("No Email"));
  if (!password || password.trim().length < 6)
    next(new ValidationError("Invalid password"));

  const user = await createUser({ email, password, name });
  res.status(201).json({ user });
});
