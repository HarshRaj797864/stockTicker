import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createUser } from "../services/createUser.js";
import { loginUser } from "../services/loginUser.js";

// for signup
const generateToken = (id, email) => {
  return jwt.sign(
    { userId: id, email: email }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" }
  );
};

export const signUp = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  
  const user = await createUser({ email, password, name });

  
  const token = generateToken(user.id, user.email);

  
  res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  
  const result = await loginUser({ email, password });

  res.status(200).json({
    token: result.token,
    user: result.sanitizeUser 
  });
});

export const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});
