import { logger } from "../utils/logger.js";
import { getExchangeRateToINR } from "./exchangeRate.service.js";
import { yahooFinance } from "./yahooFinance.client.js";

async function buildResult(
  tickerId,
  name,
  price,
  type,
  currency,
  extraData = {},
) {
  const exchangeRate = await getExchangeRateToINR(currency);
  return {
    ticker: tickerId,
    name,
    price,
    type,
    exchangeRate,
    ...extraData,
  };
}

async function fetchFromYahoo(tickerId, inputCurrency) {
  const quote = await yahooFinance.quote(tickerId);

  if (!quote) {
    throw new Error(`No quote data found for ${tickerId}`);
  }

  const currency = inputCurrency || quote.currency || "USD";

  const extraData = {
    trailingPE: quote.trailingPE,
    forwardPE: quote.forwardPE,
    epsTrailingTwelveMonths: quote.epsTrailingTwelveMonths,
    epsForward: quote.epsForward,
    priceToBook: quote.priceToBook,
    marketCap: quote.marketCap,
    dividendYield: quote.dividendYield,
    trailingAnnualDividendYield: quote.trailingAnnualDividendYield,
    fiftyDayAverage: quote.fiftyDayAverage,
    twoHundredDayAverage: quote.twoHundredDayAverage,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
    regularMarketVolume: quote.regularMarketVolume,
    averageDailyVolume3Month: quote.averageDailyVolume3Month,
    averageAnalystRating: quote.averageAnalystRating,
  };

  return buildResult(
    tickerId,
    quote.shortName || quote.longName || tickerId,
    quote.regularMarketPrice,
    quote.quoteType,
    currency,
    extraData,
  );
}

/**
 * Fetch a single ticker price (Yahoo only).
 */
export async function fetchTickerPrice(tickerId, inputCurrency = null) {
  try {
    return await fetchFromYahoo(tickerId, inputCurrency);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      ticker: tickerId,
      error: `Failed to fetch data: ${errorMsg}`,
    };
  }
}
