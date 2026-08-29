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

/**
 * Safely extracts a numeric risk score (0-100) from any tender object,
 * numeric score, or nested risk structure ({ score, level, factors } or { overallScore }).
 */
export function getSafeRiskScore(rawRisk, fallback = 30) {
  if (rawRisk === null || rawRisk === undefined) {
    return fallback;
  }
  if (typeof rawRisk === 'number' && !isNaN(rawRisk)) {
    return Math.max(0, Math.min(100, Math.round(rawRisk)));
  }
  if (typeof rawRisk === 'string') {
    const parsed = parseInt(rawRisk, 10);
    return isNaN(parsed) ? fallback : Math.max(0, Math.min(100, parsed));
  }
  if (typeof rawRisk === 'object') {
    if (typeof rawRisk.score === 'number' && !isNaN(rawRisk.score)) {
      return Math.max(0, Math.min(100, Math.round(rawRisk.score)));
    }
    if (typeof rawRisk.overallScore === 'number' && !isNaN(rawRisk.overallScore)) {
      return Math.max(0, Math.min(100, Math.round(rawRisk.overallScore)));
    }
    if (rawRisk.riskScore !== undefined) {
      return getSafeRiskScore(rawRisk.riskScore, fallback);
    }
    if (rawRisk.riskReport && typeof rawRisk.riskReport === 'object') {
      return getSafeRiskScore(rawRisk.riskReport, fallback);
    }
  }
  return fallback;
}

/**
 * Safely extracts a string risk label ('Low Risk', 'Moderate Risk', 'High Risk')
 * from any tender object or score.
 */
export function getSafeRiskLabel(tenderOrScore) {
  if (tenderOrScore && typeof tenderOrScore === 'object') {
    if (typeof tenderOrScore.riskLabel === 'string' && tenderOrScore.riskLabel.trim()) {
      return tenderOrScore.riskLabel;
    }
    if (typeof tenderOrScore.riskLevel === 'string' && tenderOrScore.riskLevel.trim()) {
      const lvl = tenderOrScore.riskLevel.toLowerCase();
      if (lvl.includes('low')) return 'Low Risk';
      if (lvl.includes('mod') || lvl.includes('med')) return 'Moderate Risk';
      if (lvl.includes('high') || lvl.includes('crit')) return 'High Risk';
      return tenderOrScore.riskLevel.charAt(0).toUpperCase() + tenderOrScore.riskLevel.slice(1);
    }
    if (typeof tenderOrScore.level === 'string' && tenderOrScore.level.trim()) {
      return tenderOrScore.level;
    }
    if (tenderOrScore.riskScore && typeof tenderOrScore.riskScore === 'object') {
      if (typeof tenderOrScore.riskScore.level === 'string') {
        return tenderOrScore.riskScore.level;
      }
    }
  }

  const numericScore = getSafeRiskScore(tenderOrScore);
  if (numericScore <= 30) return 'Low Risk';
  if (numericScore <= 50) return 'Moderate Risk';
  return 'High Risk';
}
