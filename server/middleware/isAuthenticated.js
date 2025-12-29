import jwt from 'jsonwebtoken';
import { AuthenticationError, InvalidTokenError } from './errorHandler.js';

export const isAuthenticated = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return next(new AuthenticationError("Authentication Required (No token provided)"));

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // used by next function
    req.user = decoded;
    next();
  } catch(e) {
    return next(new InvalidTokenError("Invalid or expired token"));
  }
};
