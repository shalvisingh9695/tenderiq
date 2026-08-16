/**
 * Safe text and value extractor for TenderIQ components.
 * Guarantees that SourceTraceable objects ({ value, sourceText, page, ... })
 * or nested structures are cleanly resolved to strings for React rendering.
 */

export function extractText(val, fallback = '') {
  if (val === null || val === undefined) {
    return fallback;
  }
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  if (typeof val === 'object') {
    if (val.value !== undefined && val.value !== null) {
      return extractText(val.value, fallback);
    }
    if (val.text !== undefined && val.text !== null) {
      return extractText(val.text, fallback);
    }
    if (val.title !== undefined && val.title !== null) {
      return extractText(val.title, fallback);
    }
    if (val.description !== undefined && val.description !== null) {
      return extractText(val.description, fallback);
    }
    if (val.sourceText !== undefined && val.sourceText !== null) {
      return extractText(val.sourceText, fallback);
    }
    if (Array.isArray(val)) {
      return val.map((item) => extractText(item)).filter(Boolean).join(', ') || fallback;
    }
    return fallback;
  }
  return String(val);
}

/**
 * Ensures an array of items (which might be strings or objects)
 * are all safely formatted as strings.
 */
export function extractTextList(list) {
  if (!Array.isArray(list)) {
    if (list && typeof list === 'object') {
      const txt = extractText(list);
      return txt ? [txt] : [];
    }
    if (typeof list === 'string' && list.trim()) {
      return [list];
    }
    return [];
  }
  return list
    .map((item) => extractText(item))
    .filter((item) => item && typeof item === 'string' && item.trim().length > 0);
}
