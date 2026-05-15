import { Router } from "express";
import { API_PREFIX } from "../config/constants.js";
import healthRoutes from "./health.routes.js";
import tickersRoutes from "./tickers.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(API_PREFIX, tickersRoutes);

export default router;
