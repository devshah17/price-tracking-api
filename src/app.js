import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import { logger } from "./utils/logger.js";

function parseCorsOrigin(origin) {
  if (!origin || origin === "*") return true;
  return origin.split(",").map((o) => o.trim());
}

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: parseCorsOrigin(env.CORS_ORIGIN),
      methods: ["GET", "POST"],
    })
  );
  app.use(
    pinoHttp({
      logger,
      autoLogging: env.NODE_ENV !== "test",
    })
  );

  app.use(express.json({ limit: "256kb" }));
  app.use(express.urlencoded({ extended: true, limit: "256kb" }));

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
