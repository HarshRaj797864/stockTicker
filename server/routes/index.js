import {Router} from "express";
import {getHealth} from "../controllers/appController.js";

const healthRouter = Router();
healthRouter.get("/health", getHealth);

export {healthRouter};
