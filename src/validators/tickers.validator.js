import { z } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

const tickerItemSchema = z.union([
  z.string().min(1),
  z.object({
    ticker: z.string().min(1),
    currency: z.string().min(1).optional(),
  }),
]);

export const postTickersBodySchema = z.object({
  tickers: z
    .array(tickerItemSchema)
    .min(1, "At least one ticker is required")
    .max(
      env.MAX_TICKERS_PER_REQUEST,
      `Maximum ${env.MAX_TICKERS_PER_REQUEST} tickers per request`
    ),
});

export function validatePostTickersBody(body) {
  const result = postTickersBodySchema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join("; ");
    throw new AppError(message, 400, "VALIDATION_ERROR");
  }
  return result.data;
}
