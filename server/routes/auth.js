import { Router } from "express";
import { signUp, login } from "../controllers/authController.js";

const authRouter = Router();
authRouter.post("/signup", signUp);
authRouter.post("/login", login);

export {authRouter};
