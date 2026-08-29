/**
 * Resilient JSON parsing helper for AI responses.
 * Handles markdown code fences, unclosed brackets/braces from token limits,
 * and trailing commas.
 */
export function parseSafeJson(text, fallback = null) {
  if (!text || typeof text !== 'string') {
    return fallback;
  }

  let cleaned = text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // 1. Direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Continue to repair strategies
  }

  // 2. Extract first valid JSON object/array block if wrapped in narrative
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIndex = -1;

  if (firstBrace !== -1 && firstBracket !== -1) {
    startIndex = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIndex = firstBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
  }

  if (startIndex > 0) {
    cleaned = cleaned.substring(startIndex);
  }

  // 3. Balance unclosed string literals and brackets/braces
  try {
    let repaired = cleaned;
    const stack = [];
    let inString = false;
    let escaped = false;

    for (let i = 0; i < repaired.length; i++) {
      const char = repaired[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{' || char === '[') {
          stack.push(char);
        } else if (char === '}') {
          if (stack.length > 0 && stack[stack.length - 1] === '{') {
            stack.pop();
          }
        } else if (char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === '[') {
            stack.pop();
          }
        }
      }
    }

    if (inString) {
      repaired += '"';
    }

    // Strip trailing commas before closing
    repaired = repaired.replace(/,\s*$/, '');

    while (stack.length > 0) {
      const last = stack.pop();
      if (last === '{') repaired += '}';
      else if (last === '[') repaired += ']';
    }

    return JSON.parse(repaired);
  } catch (repairErr) {
    // 4. Last fallback: try substring between first and last brace
    const firstObjBrace = cleaned.indexOf('{');
    const lastObjBrace = cleaned.lastIndexOf('}');
    if (firstObjBrace !== -1 && lastObjBrace > firstObjBrace) {
      try {
        return JSON.parse(cleaned.substring(firstObjBrace, lastObjBrace + 1));
      } catch (e3) {
        // failed
      }
    }
  }

  if (fallback !== null) {
    return fallback;
  }

  throw new Error('AI returned an invalid JSON response format.');
}
