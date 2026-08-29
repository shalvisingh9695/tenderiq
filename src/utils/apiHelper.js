/**
 * Safe API Fetch & Connection Utility for TenderIQ
 *
 * Automatically resolves the backend URL from environment variables (VITE_API_URL or REACT_APP_API_URL)
 * for standalone deployments (e.g. Vercel frontend -> Render/Railway backend)
 * and seamlessly defaults to relative `/api` paths for full-stack containers.
 */

// Retrieve and normalize the production or development API Base URL
let activeBaseUrlOverride = null;

export function getApiBaseUrl() {
  if (activeBaseUrlOverride !== null) {
    return activeBaseUrlOverride;
  }

  const envUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
    ''
  ).trim();

  // Strip trailing slashes
  return envUrl.replace(/\/+$/, '');
}

export function setApiBaseUrlOverride(override) {
  activeBaseUrlOverride = override;
}

/**
 * Returns the fully qualified endpoint URL
 * @param {string} endpoint - e.g. '/api/tenders' or 'api/upload'
 * @param {string|null} baseOverride - optional base URL
 * @returns {string}
 */
export function getApiUrl(endpoint = '', baseOverride = null) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://') || endpoint.startsWith('blob:')) {
    return endpoint;
  }

  const base = baseOverride !== null ? baseOverride : getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
}

/**
 * Standard fetch with automatic JSON parsing, HTML error detection,
 * configurable timeout, automatic local fallback on remote 404/failure,
 * and standardized error messaging.
 *
 * @param {string} url - API route
 * @param {RequestInit & { timeoutMs?: number, disableFallback?: boolean }} options - Fetch options
 * @returns {Promise<any>}
 */
export async function safeFetchJson(url, options = {}) {
  const base = getApiBaseUrl();
  const fullUrl = getApiUrl(url);
  const timeoutMs = options.timeoutMs || 90000;

  const performFetch = async (targetUrl) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const fetchOptions = {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    };

    // Automatically set Content-Type to application/json for non-FormData objects
    if (
      fetchOptions.body &&
      typeof fetchOptions.body === 'string' &&
      !fetchOptions.headers['Content-Type']
    ) {
      fetchOptions.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(targetUrl, fetchOptions);
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      let data = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Detect HTML error responses (e.g. 502/504 gateway or 404 proxy pages)
        if (text.startsWith('<!doctype') || text.startsWith('<html') || text.includes('<body')) {
          throw new Error(
            `Server returned an HTML response (${response.status} ${response.statusText}).`
          );
        }
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Unexpected server response (${response.status}): ${text.slice(0, 160)}`
          );
        }
      }

      if (!response.ok) {
        const errMsg =
          data?.error ||
          data?.message ||
          `Request to ${targetUrl} failed with status ${response.status} (${response.statusText})`;
        const errorObj = new Error(errMsg);
        errorObj.status = response.status;
        throw errorObj;
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        const timeoutError = new Error(`Request timed out after ${Math.round(timeoutMs / 1000)}s.`);
        timeoutError.isTimeout = true;
        throw timeoutError;
      }
      throw err;
    }
  };

  try {
    return await performFetch(fullUrl);
  } catch (primaryErr) {
    // If we were requesting an external base URL and it returned 404, 5xx, or network failure,
    // gracefully attempt the local / relative route (/api/*) served by this container
    const isExternalUrl = base && (fullUrl.startsWith('http://') || fullUrl.startsWith('https://'));
    const isRelativeTarget = url.startsWith('/api') || url.startsWith('api');

    if (isExternalUrl && isRelativeTarget && !options.disableFallback) {
      const relativeUrl = url.startsWith('/') ? url : `/${url}`;
      try {
        console.warn(`[API Fallback] External endpoint "${fullUrl}" failed (${primaryErr.message}). Falling back to local "${relativeUrl}"...`);
        const fallbackData = await performFetch(relativeUrl);
        // If local relative endpoint succeeded, switch default base URL to relative to avoid repeated external failures
        setApiBaseUrlOverride('');
        return fallbackData;
      } catch (fallbackErr) {
        console.error(`[API Error] Both remote and local fallback failed for ${url}:`, fallbackErr.message || fallbackErr);
        throw primaryErr;
      }
    }

    console.error(`[API Error] ${options.method || 'GET'} ${fullUrl}:`, primaryErr.message || primaryErr);
    throw primaryErr;
  }
}

/**
 * Convenient API Client helpers for GET, POST, PUT, DELETE
 */
export const apiClient = {
  get: (url, options = {}) =>
    safeFetchJson(url, { ...options, method: 'GET' }),

  post: (url, body, options = {}) =>
    safeFetchJson(url, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body)
    }),

  put: (url, body, options = {}) =>
    safeFetchJson(url, {
      ...options,
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body)
    }),

  delete: (url, options = {}) =>
    safeFetchJson(url, { ...options, method: 'DELETE' })
};

export default apiClient;


