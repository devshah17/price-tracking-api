/**
 * Normalizes request ticker entries (string or { ticker, currency? }).
 * @returns {{ tickerId: string, currency: string | null } | null}
 */
export function parseTickerInput(item) {
  if (typeof item === "string") {
    const tickerId = item.trim();
    return tickerId ? { tickerId, currency: null } : null;
  }

  if (item && typeof item === "object" && typeof item.ticker === "string") {
    const tickerId = item.ticker.trim();
    const currency =
      typeof item.currency === "string" && item.currency.trim()
        ? item.currency.trim().toUpperCase()
        : null;
    return tickerId ? { tickerId, currency } : null;
  }

  return null;
}
