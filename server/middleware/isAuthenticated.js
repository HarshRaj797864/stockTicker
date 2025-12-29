import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res
      .status(401)
      .json({ error: "Authentication Required (No token provided)" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // used by next function
    req.user = decoded;
    next();
  } catch(e) {
    return res.status(403).json({ error: "Invalid or expired token "});
  }
};
