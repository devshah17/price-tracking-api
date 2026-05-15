import { logger } from "../utils/logger.js";
import { yahooFinance } from "./yahooFinance.client.js";

/**
 * Live FX rate from currency to INR (1 unit of currency in INR).
 */
export async function getExchangeRateToINR(currency) {
  if (!currency || currency === "INR") return 1;

  try {
    const fxQuote = await yahooFinance.quote(`${currency}INR=X`);
    if (fxQuote?.regularMarketPrice) {
      return fxQuote.regularMarketPrice;
    }
  } catch (err) {
    logger.warn(
      { currency, err: err.message },
      "Failed to fetch exchange rate; defaulting to 1"
    );
  }

  return 1;
}
