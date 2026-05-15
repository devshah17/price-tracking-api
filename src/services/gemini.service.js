import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { logger } from "../utils/logger.js";

let client = null;

function getClient() {
  if (!env.GEMINI_API_KEY) {
    throw new AppError(
      "Gemini API key is not configured",
      503,
      "GEMINI_NOT_CONFIGURED"
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return client;
}

/**
 * @returns {{ name: string, price: number }}
 */
export async function fetchPriceViaGemini(tickerId) {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: `Search the web for the current stock price or NAV (Net Asset Value) of ${tickerId} and return the result in JSON format with keys "name" (string) and "price" (number). Do not include any markdown formatting or comments. Just valid JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
    },
  });

  const dataText = response.text;
  let parsed;

  try {
    parsed = JSON.parse(dataText);
  } catch {
    logger.error({ tickerId, dataText }, "Invalid JSON from Gemini");
    throw new AppError("Failed to parse price data from Gemini", 502, "GEMINI_PARSE_ERROR");
  }

  if (parsed?.price === undefined || parsed?.price === null) {
    throw new AppError("Invalid or empty data returned from Gemini", 502, "GEMINI_EMPTY");
  }

  return {
    name: parsed.name || tickerId,
    price: Number(parsed.price),
  };
}
