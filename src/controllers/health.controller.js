import { APP_NAME } from "../config/constants.js";
import { env } from "../config/env.js";

export function getRoot(_req, res) {
  res.json({
    name: APP_NAME,
    status: "ok",
    environment: env.NODE_ENV,
  });
}

export function getHealth(_req, res) {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

export function getReady(_req, res) {
  res.json({
    status: "ready",
    geminiConfigured: Boolean(env.GEMINI_API_KEY),
  });
}
