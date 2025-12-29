import { Router } from "express";
import { signUp, login, getMe } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const authRouter = Router();
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/me", isAuthenticated, getMe);
export { authRouter };
