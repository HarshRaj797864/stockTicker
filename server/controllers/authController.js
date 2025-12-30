import { asyncHandler } from "../utils/asyncHandler.js";
import { ValidationError } from "../middleware/errorHandler.js";
import { createUser } from "../services/createUser.js";
import { loginUser } from "../services/loginUser.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  const user = await createUser({ email, password, name });
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  const result = await loginUser({email, password});
  res.status(200).json(result);
});

export const getMe = asyncHandler(async (req, res, next) => {
  return res.status(200).json(req.user);
});
