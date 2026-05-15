import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3002),
  GEMINI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default("*"),
  MAX_TICKERS_PER_REQUEST: z.coerce.number().int().positive().default(50),
  TICKER_FETCH_CONCURRENCY: z.coerce.number().int().positive().default(5),
  GEMINI_MODEL: z.string().default("gemini-3.1-flash-lite"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

if (env.NODE_ENV === "production" && !env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is required in production (Gemini fallback).");
  process.exit(1);
}

export { env };
