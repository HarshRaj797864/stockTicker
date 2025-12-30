import { Router } from "express";
import { signUp, login, getMe } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../schemas/authSchemas.js";

const authRouter = Router();
console.log("DEBUG SCHEMA IMPORT:", signupSchema);
authRouter.post("/signup", signUp);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", isAuthenticated, getMe);
export { authRouter };
