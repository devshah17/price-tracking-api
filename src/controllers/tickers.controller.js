import { env } from "../config/env.js";
import { fetchTickerPrice } from "../services/tickerPrice.service.js";
import { mapWithConcurrency } from "../utils/mapWithConcurrency.js";
import { parseTickerInput } from "../utils/parseTickerInput.js";
import { validatePostTickersBody } from "../validators/tickers.validator.js";

export async function postTickers(req, res) {
  const { tickers } = validatePostTickersBody(req.body);

  const parsed = tickers
    .map(parseTickerInput)
    .filter(Boolean);

  const results = await mapWithConcurrency(
    parsed,
    env.TICKER_FETCH_CONCURRENCY,
    ({ tickerId, currency }) => fetchTickerPrice(tickerId, currency)
  );

  res.json({ success: true, data: results });
}
