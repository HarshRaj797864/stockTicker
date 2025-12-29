import { Router } from "express";
import { create, getAll } from "../controllers/watchlistController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const watchlistRouter = Router();
watchlistRouter.use(isAuthenticated);
watchlistRouter.post("/", create);
watchlistRouter.get("/", getAll);

export {watchlistRouter};
