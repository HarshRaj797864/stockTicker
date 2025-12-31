import { Router } from "express";
import { addStock, create, getAll, removeStock } from "../controllers/watchlistController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const watchlistRouter = Router();
watchlistRouter.use(isAuthenticated);
watchlistRouter.post("/", create);
watchlistRouter.get("/", getAll);
watchlistRouter.post("/:id/stocks", addStock);
watchlistRouter.delete("/:id/stocks/:ticker", removeStock);

export {watchlistRouter};
