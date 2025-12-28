import {Router} from "express";
import {getHealth} from "../controllers/appController.js";

const router = Router();
router.get("/health", getHealth);

export {router};
