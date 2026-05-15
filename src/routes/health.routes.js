import { Router } from "express";
import {
  getHealth,
  getReady,
  getRoot,
} from "../controllers/health.controller.js";

const router = Router();

router.get("/", getRoot);
router.get("/health", getHealth);
router.get("/ready", getReady);

export default router;
