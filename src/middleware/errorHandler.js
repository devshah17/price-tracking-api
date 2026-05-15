import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export function notFoundHandler(_req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  logger.error({ err }, "Unhandled error");

  const message =
    env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message },
  });
}
