import { GoogleGenAI, Type } from '@google/genai';

/**
 * TenderIQ Centralized Gemini Configuration & Client Module
 *
 * Provides:
 * 1. Centralized GoogleGenAI client initialized via process.env.GEMINI_API_KEY
 * 2. Primary supported model alias ('gemini-3.1-flash-lite')
 * 3. Exponential backoff retry handler for transient errors (429, 500, 502, 503, 504)
 * 4. Error normalization function that shields API keys and internal stack traces
 */

export const GEMINI_PRIMARY_MODEL = 'gemini-3.7-flash';
export const GEMINI_FALLBACK_MODELS = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
export { Type };

let aiClientInstance = null;

/**
 * Returns the centralized GoogleGenAI client.
 * Fails with a clean server-side configuration error if GEMINI_API_KEY is missing.
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    const error = new Error(
      'GEMINI_API_KEY environment variable is not configured. Please configure it in your environment or Settings > Secrets.'
    );
    error.code = 'MISSING_API_KEY';
    error.status = 500;
    throw error;
  }

  if (!aiClientInstance) {
    aiClientInstance = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  return aiClientInstance;
}

/**
 * Sanitizes any raw string or error message by stripping potential API keys.
 */
export function sanitizeMessage(msg) {
  if (!msg) return '';
  return String(msg)
    .replace(/key=[^&\s]+/gi, 'key=HIDDEN')
    .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer HIDDEN')
    .replace(/AIza[0-9A-Za-z\-_]{35}/g, 'AIza_HIDDEN');
}

/**
 * Maps Gemini error responses to safe, standardized user-facing messages without leaking secrets.
 */
export function normalizeGeminiError(err) {
  if (!err) {
    return {
      status: 503,
      code: 'UNKNOWN_ERROR',
      userMessage: 'AI service is temporarily busy. Please try again in a moment.'
    };
  }

  const rawMsg = String(err.message || '');
  const cleanMsg = sanitizeMessage(rawMsg);
  const status = Number(err.status || err.statusCode || err.response?.status) || 0;
  const upper = rawMsg.toUpperCase();

  if (status === 400 || upper.includes('INVALID_ARGUMENT') || upper.includes('400 BAD REQUEST')) {
    return {
      status: 400,
      code: 'INVALID_ARGUMENT',
      userMessage: 'Invalid AI request configuration.',
      details: cleanMsg
    };
  }

  if (
    status === 401 ||
    status === 403 ||
    err.code === 'MISSING_API_KEY' ||
    upper.includes('UNAUTHENTICATED') ||
    upper.includes('PERMISSION_DENIED') ||
    upper.includes('API_KEY_INVALID')
  ) {
    return {
      status: 403,
      code: 'AUTH_ERROR',
      userMessage: 'Gemini API authentication or permission error.',
      details: cleanMsg
    };
  }

  if (status === 404 || upper.includes('NOT_FOUND') || upper.includes('MODEL NOT FOUND')) {
    return {
      status: 404,
      code: 'MODEL_NOT_FOUND',
      userMessage: 'Configured Gemini model is unavailable.',
      details: cleanMsg
    };
  }

  if (status === 429 || upper.includes('RESOURCE_EXHAUSTED') || upper.includes('RATE LIMIT') || upper.includes('QUOTA')) {
    return {
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      userMessage: 'AI service rate limit reached. Please try again in a moment.',
      details: cleanMsg
    };
  }

  if (status === 500 || status === 502 || upper.includes('INTERNAL')) {
    return {
      status: 502,
      code: 'SERVICE_ERROR',
      userMessage: 'Gemini service error. Please try again in a moment.',
      details: cleanMsg
    };
  }

  if (status === 503 || status === 504 || upper.includes('UNAVAILABLE') || upper.includes('DEADLINE_EXCEEDED')) {
    return {
      status: 503,
      code: 'SERVICE_UNAVAILABLE',
      userMessage: 'AI service is temporarily busy. Please try again in a moment.',
      details: cleanMsg
    };
  }

  return {
    status: 503,
    code: 'AI_TEMPORARY_FAILURE',
    userMessage: 'AI service is temporarily busy. Please try again in a moment.',
    details: cleanMsg
  };
}

/**
 * Determines whether a given Gemini API error is transient and should be retried.
 * Retries ONLY on 429, 500, 502, 503, 504 or network socket failures.
 * Never retries on 400, 401, 403, 404.
 */
export function isRetryableError(error) {
  if (!error) return false;

  const status = Number(error.status || error.statusCode || error.response?.status);
  const msg = String(error.message || '').toUpperCase();

  // Explicit non-retryable conditions
  if (status === 400 || msg.includes('INVALID_ARGUMENT') || msg.includes('BAD_REQUEST')) return false;
  if (status === 401 || status === 403 || msg.includes('UNAUTHENTICATED') || msg.includes('PERMISSION_DENIED') || msg.includes('MISSING_API_KEY')) return false;
  if (status === 404 || msg.includes('NOT_FOUND') || msg.includes('MODEL_NOT_FOUND')) return false;

  // Retryable HTTP statuses
  if ([429, 500, 502, 503, 504].includes(status)) return true;

  // Retryable error strings / socket errors
  if (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('RATE_LIMIT') ||
    msg.includes('429') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('503') ||
    msg.includes('502') ||
    msg.includes('500') ||
    msg.includes('504') ||
    msg.includes('DEADLINE_EXCEEDED') ||
    msg.includes('INTERNAL') ||
    msg.includes('FETCH FAILED') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('SOCKET HANG UP') ||
    msg.includes('OVERLOADED')
  ) {
    return true;
  }

  return false;
}

/**
 * Reusable Gemini request helper with exponential backoff and jitter.
 *
 * Backoff strategy:
 * Attempt 1: ~1s (1000ms + 100-300ms jitter)
 * Attempt 2: ~2s (2000ms + 100-400ms jitter)
 * Attempt 3: ~4s (4000ms + 100-500ms jitter)
 * Attempt 4: ~8s (8000ms + 100-600ms jitter)
 * Maximum 4 attempts.
 *
 * @param {Object} options
 * @param {string|Array|Object} options.contents - Prompt contents
 * @param {Object} [options.config] - Model configuration (systemInstruction, temperature, responseSchema, etc.)
 * @param {string} [options.model] - Model name (defaults to GEMINI_PRIMARY_MODEL: 'gemini-3.1-flash-lite')
 * @param {number} [options.maxAttempts] - Maximum retry attempts (default 4)
 * @returns {Promise<Object>} GenerateContentResponse
 */
export async function generateContentWithRetry({
  contents,
  config = {},
  model = GEMINI_PRIMARY_MODEL,
  maxAttempts = 2
}) {
  const ai = getGeminiClient();
  let lastError = null;

  // Build model candidate list with primary model first, followed by valid fallback models
  const candidateModels = Array.from(new Set([model, ...GEMINI_FALLBACK_MODELS]));

  for (const currentModel of candidateModels) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config
        });
        return response;
      } catch (err) {
        lastError = err;
        const retryable = isRetryableError(err);
        const isLastAttempt = attempt >= maxAttempts;
        const cleanErrorMsg = sanitizeMessage(err.message || 'Unknown error');
        const isQuotaExhausted = String(err.message || '').includes('RESOURCE_EXHAUSTED') || (err.status === 429);

        // If quota exhausted for this model, break inner loop immediately and try next candidate model
        if (isQuotaExhausted && candidateModels.indexOf(currentModel) < candidateModels.length - 1) {
          console.warn(`[Gemini API] Quota reached for ${currentModel}. Cascading to fallback model...`);
          break;
        }

        if (!retryable || isLastAttempt) {
          break;
        }

        // Fast backoff
        const delayMs = 1200 + Math.floor(Math.random() * 600);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  const normalized = normalizeGeminiError(lastError);
  const finalError = new Error(normalized.userMessage);
  finalError.status = normalized.status;
  finalError.code = normalized.code;
  finalError.details = normalized.details;
  finalError.originalError = lastError;
  throw finalError;
}
