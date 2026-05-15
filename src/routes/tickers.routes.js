import { Router } from "express";
import { postTickers } from "../controllers/tickers.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/tickers", asyncHandler(postTickers));

export default router;
