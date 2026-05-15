import { logger } from "../utils/logger.js";
import { getExchangeRateToINR } from "./exchangeRate.service.js";
import { fetchPriceViaGemini } from "./gemini.service.js";
import { yahooFinance } from "./yahooFinance.client.js";

async function buildResult(tickerId, name, price, type, currency) {
  const exchangeRate = await getExchangeRateToINR(currency);
  return {
    ticker: tickerId,
    name,
    price,
    type,
    exchangeRate,
  };
}

async function fetchFromYahoo(tickerId, inputCurrency) {
  const quote = await yahooFinance.quote(tickerId);
  if (!quote) {
    throw new Error(`No quote data found for ${tickerId}`);
  }

  const currency = inputCurrency || quote.currency || "USD";
  return buildResult(
    tickerId,
    quote.shortName || quote.longName || tickerId,
    quote.regularMarketPrice,
    quote.quoteType,
    currency
  );
}

async function fetchFromGemini(tickerId, inputCurrency) {
  const { name, price } = await fetchPriceViaGemini(tickerId);
  const currency = inputCurrency || "INR";
  return buildResult(tickerId, name, price, "MF", currency);
}

/**
 * Fetch a single ticker price (Yahoo first, Gemini fallback).
 */
export async function fetchTickerPrice(tickerId, inputCurrency = null) {
  try {
    return await fetchFromYahoo(tickerId, inputCurrency);
  } catch (yahooErr) {
    logger.warn(
      { tickerId, err: yahooErr.message },
      "Yahoo Finance failed; trying Gemini fallback"
    );

    try {
      return await fetchFromGemini(tickerId, inputCurrency);
    } catch (geminiErr) {
      const yahooMsg = yahooErr.message;
      const geminiMsg =
        geminiErr instanceof Error ? geminiErr.message : String(geminiErr);

      return {
        ticker: tickerId,
        error: `Failed to fetch data: ${yahooMsg}. Fallback error: ${geminiMsg}`,
      };
    }
  }
}
