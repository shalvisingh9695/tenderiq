/**
 * Safe API Fetch Utility for TenderIQ
 *
 * Ensures responses are checked for content-type before parsing JSON,
 * eliminating "Unexpected token '<', '<!doctype' is not valid JSON" errors.
 */

export async function safeFetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';

    let data = null;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If server returned HTML (e.g. 500 / 404 proxy page)
      if (text.startsWith('<!doctype') || text.startsWith('<html')) {
        throw new Error(
          `Server returned HTML error (${response.status} ${response.statusText}). Please verify the backend service is running.`
        );
      }
      throw new Error(`Unexpected server response (${response.status}): ${text.slice(0, 150)}`);
    }

    if (!response.ok) {
      throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err.message || err);
    throw err;
  }
}
