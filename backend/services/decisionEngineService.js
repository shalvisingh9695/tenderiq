import { generateContentWithRetry, GEMINI_PRIMARY_MODEL, Type } from '../config/gemini.js';
import { parseSafeJson } from '../utils/jsonHelper.js';

/**
 * Helper to extract numeric monetary amount from text or numbers.
 * Handles e.g. "$5,000,000", "$5M", "5 Million", "5 Crore", "50 Lakhs", 8000000
 */
function parseAmount(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).toLowerCase().replace(/,/g, '');

  // Millions
  const mMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:m|million|mn)/i);
  if (mMatch) return parseFloat(mMatch[1]) * 1000000;

  // Thousands
  const kMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand)/i);
  if (kMatch) return parseFloat(kMatch[1]) * 1000;

  // Crores
  const crMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i);
  if (crMatch) return parseFloat(crMatch[1]) * 10000000;

  // Lakhs
  const lMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l)/i);
  if (lMatch) return parseFloat(lMatch[1]) * 100000;

  // Direct digits
  const digits = str.match(/(\d+(?:\.\d+)?)/);
  if (digits) return parseFloat(digits[1]);

  return 0;
}

/**
 * Helper to extract number of years from text or numbers
 */
function parseYears(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const match = String(val).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Core Decision Engine Service for TenderIQ
 * Computes deterministic scores + generates concise Gemini AI explanation for:
 * 1. Eligibility Match Score (0-100) & eligibilityFailure (boolean)
 * 2. Financial Fit Score (0-100)
 * 3. Compliance Score (0-100)
 * 4. Risk Impact Score (0-100)
 * 5. Recommendation ("Apply" | "Consider" | "Avoid")
 * 6. Win Probability (0-100)
 * 7. AI Executive Decision Explanation (summary, strengths, weaknesses, gaps)
 */
export class DecisionEngineService {
  /**
   * Evaluates bid decision for a given company profile and tender analysis/risk report
   */
  static async evaluateDecision({ tenderId, structuredAnalysis, riskReport, companyProfile }) {
    if (!companyProfile || typeof companyProfile !== 'object' || Object.keys(companyProfile).length === 0) {
      throw new Error('A valid companyProfile object is required for Decision Engine evaluation.');
    }

    if (!structuredAnalysis || typeof structuredAnalysis !== 'object') {
      throw new Error('Structured tender analysis is required before running the Decision Engine.');
    }

    if (!riskReport || typeof riskReport !== 'object') {
      throw new Error('Risk Intelligence report is required before running the Decision Engine.');
    }

    // --- 1. EXTRACT VENDOR COMPANY PROFILE DATA ---
    const companyName = companyProfile.companyName || 'Company';
    const companyTurnover = parseAmount(companyProfile.annualTurnover);
    const companyYears = parseYears(companyProfile.yearsOfExperience);
    const companySimilarExp = Boolean(
      companyProfile.similarProjectExperience === true ||
      (typeof companyProfile.similarProjectExperience === 'object' && companyProfile.similarProjectExperience?.completed) ||
      (typeof companyProfile.similarProjectExperience === 'string' && companyProfile.similarProjectExperience.trim().length > 0)
    );

    const companyCerts = (
      Array.isArray(companyProfile.certifications)
        ? companyProfile.certifications
        : typeof companyProfile.certifications === 'string'
        ? companyProfile.certifications.split(',')
        : []
    ).map(c => String(c).toLowerCase().trim()).filter(Boolean);

    const companyRegs = (
      Array.isArray(companyProfile.registrations)
        ? companyProfile.registrations
        : typeof companyProfile.registrations === 'string'
        ? companyProfile.registrations.split(',')
        : []
    ).map(r => String(r).toLowerCase().trim()).filter(Boolean);

    const manpowerCapacity = parseAmount(companyProfile.manpowerCapacity);
    const isMSME = Boolean(companyProfile.MSMEorStartup);

    // --- 2. EXTRACT STRUCTURED TENDER REQUIREMENTS ---
    const eligibility = structuredAnalysis.eligibility || {};
    const financialReqs = structuredAnalysis.financialRequirements || {};
    const basicInfo = structuredAnalysis.basicInformation || {};
    const mandatoryDocs = structuredAnalysis.mandatoryDocuments || [];

    // --- 3. ELIGIBILITY MATCH SCORE (0–100) & ELIGIBILITY FAILURE ---
    // a) Turnover check
    const requiredTurnover = parseAmount(
      eligibility.annualTurnover?.value || eligibility.annualTurnover || basicInfo.estimatedValue
    ) || 0;

    let turnoverScore = 100;
    let turnoverFail = false;
    let turnoverGap = null;

    if (requiredTurnover > 0) {
      if (companyTurnover >= requiredTurnover) {
        turnoverScore = 100;
      } else if (companyTurnover >= requiredTurnover * 0.7) {
        turnoverScore = 75;
        turnoverGap = `Company turnover ($${companyTurnover.toLocaleString()}) is below required ($${requiredTurnover.toLocaleString()})`;
      } else {
        turnoverScore = Math.max(0, Math.round((companyTurnover / requiredTurnover) * 100));
        turnoverGap = `Company turnover ($${companyTurnover.toLocaleString()}) fails requirement ($${requiredTurnover.toLocaleString()})`;
        if (!isMSME) {
          turnoverFail = true;
        }
      }
    }

    // b) Years of Experience check
    const requiredYears = parseYears(
      eligibility.yearsOfExperience?.value || eligibility.yearsOfExperience
    ) || 0;

    let experienceScore = 100;
    let experienceFail = false;
    let experienceGap = null;

    if (requiredYears > 0) {
      if (companyYears >= requiredYears) {
        experienceScore = 100;
      } else if (companyYears >= requiredYears * 0.7) {
        experienceScore = 70;
        experienceGap = `Experience (${companyYears} yrs) is slightly below requirement (${requiredYears} yrs)`;
      } else {
        experienceScore = Math.max(0, Math.round((companyYears / requiredYears) * 100));
        experienceGap = `Company experience (${companyYears} yrs) fails requirement (${requiredYears} yrs)`;
        experienceFail = true;
      }
    }

    // c) Certifications match
    const requiredCertsList = (eligibility.requiredCertifications || []).map(c =>
      typeof c === 'string' ? c : (c.value || c.name || '')
    ).filter(Boolean);

    let certScore = 100;
    let certFail = false;
    const missingCerts = [];

    if (requiredCertsList.length > 0) {
      let matchedCount = 0;
      requiredCertsList.forEach(reqCert => {
        const reqLower = reqCert.toLowerCase();
        const hasCert = companyCerts.some(cc => cc.includes(reqLower) || reqLower.includes(cc));
        if (hasCert) {
          matchedCount++;
        } else {
          missingCerts.push(reqCert);
        }
      });
      certScore = Math.round((matchedCount / requiredCertsList.length) * 100);
      if (certScore === 0 && requiredCertsList.length > 0) {
        certFail = true;
      }
    }

    // d) Registrations match
    const requiredRegsList = (eligibility.requiredRegistrations || []).map(r =>
      typeof r === 'string' ? r : (r.value || r.name || '')
    ).filter(Boolean);

    let regScore = 100;
    let regFail = false;
    const missingRegs = [];

    if (requiredRegsList.length > 0) {
      let matchedRegs = 0;
      requiredRegsList.forEach(reqReg => {
        const reqLower = reqReg.toLowerCase();
        const hasReg = companyRegs.some(cr => cr.includes(reqLower) || reqLower.includes(cr));
        if (hasReg) {
          matchedRegs++;
        } else {
          missingRegs.push(reqReg);
        }
      });
      regScore = Math.round((matchedRegs / requiredRegsList.length) * 100);
      if (regScore === 0 && requiredRegsList.length > 0) {
        regFail = true;
      }
    }

    // e) Similar Experience
    let similarScore = companySimilarExp ? 100 : 40;

    // Rule: If mandatory requirement fails → mark eligibilityFailure = true
    const eligibilityFailure = turnoverFail || experienceFail || certFail || regFail;

    // Weighted Eligibility Score (0–100)
    let rawEligibility = Math.round(
      (turnoverScore * 0.35) +
      (experienceScore * 0.25) +
      (certScore * 0.20) +
      (regScore * 0.10) +
      (similarScore * 0.10)
    );

    let eligibilityMatchScore = eligibilityFailure
      ? Math.min(rawEligibility, 40)
      : Math.min(100, Math.max(0, rawEligibility));

    // --- 4. FINANCIAL FIT SCORE (0–100) ---
    const emdAmount = parseAmount(financialReqs.emd?.value || financialReqs.emd) || 0;
    const perfSecAmount = parseAmount(financialReqs.performanceSecurity?.value || financialReqs.performanceSecurity) || 0;
    const totalCommitment = emdAmount + perfSecAmount;

    let financialFitScore = 85;
    if (companyTurnover > 0 && totalCommitment > 0) {
      const commitmentRatio = totalCommitment / companyTurnover;
      if (commitmentRatio <= 0.03) financialFitScore = 100;
      else if (commitmentRatio <= 0.08) financialFitScore = 85;
      else if (commitmentRatio <= 0.15) financialFitScore = 65;
      else if (commitmentRatio <= 0.25) financialFitScore = 45;
      else financialFitScore = 25;
    }

    if (isMSME) {
      financialFitScore = Math.min(100, financialFitScore + 10);
    }

    // --- 5. COMPLIANCE SCORE (0–100) ---
    const docCount = Array.isArray(mandatoryDocs) ? mandatoryDocs.length : 0;
    let docComplexityScore = 95;
    if (docCount > 10) docComplexityScore = 55;
    else if (docCount > 6) docComplexityScore = 70;
    else if (docCount > 3) docComplexityScore = 85;

    const complianceRisk = riskReport.categoryScores?.complianceRisk?.score || (riskReport.overallScore ? Math.round(riskReport.overallScore * 0.5) : 30);
    const complianceSafety = Math.max(0, 100 - complianceRisk);

    const complianceScore = Math.min(100, Math.max(0, Math.round((docComplexityScore * 0.5) + (complianceSafety * 0.5))));

    // --- 6. RISK IMPACT SCORE (0–100) ---
    // Take from riskReport.overallScore. Convert: Higher risk → lower suitability (100 - overallRisk)
    const overallRisk = typeof riskReport.overallScore === 'number'
      ? riskReport.overallScore
      : (typeof riskReport.overallRisk === 'number' ? riskReport.overallRisk : 50);

    const riskImpactScore = Math.min(100, Math.max(0, 100 - overallRisk));

    // --- 7. FINAL DECISION LOGIC ---
    let recommendation = 'Consider';

    if (eligibilityFailure) {
      recommendation = 'Avoid';
    } else if (eligibilityMatchScore < 50 && riskImpactScore < 50) {
      // eligibility < 50 AND risk high (riskImpactScore < 50 means overallRisk > 50)
      recommendation = 'Avoid';
    } else if (eligibilityMatchScore >= 50 && eligibilityMatchScore < 75 && riskImpactScore < 50) {
      // eligibility medium AND risk high
      recommendation = 'Consider';
    } else if (eligibilityMatchScore >= 75 && riskImpactScore >= 50) {
      // eligibility high AND risk moderate/low
      recommendation = 'Apply';
    } else {
      if (eligibilityMatchScore < 50) recommendation = 'Avoid';
      else if (riskImpactScore < 40) recommendation = 'Consider';
      else if (eligibilityMatchScore >= 70) recommendation = 'Apply';
      else recommendation = 'Consider';
    }

    // --- 8. WIN PROBABILITY (0–100) ---
    // Weighted: eligibility (40%), risk impact (30%), financial (15%), compliance (15%)
    let rawWinProbability = Math.round(
      (eligibilityMatchScore * 0.40) +
      (riskImpactScore * 0.30) +
      (financialFitScore * 0.15) +
      (complianceScore * 0.15)
    );

    if (eligibilityFailure) {
      rawWinProbability = Math.min(rawWinProbability, 20);
    }

    const winProbability = Math.max(0, Math.min(100, rawWinProbability));

    // Compile Default Fallback Gaps, Strengths & Weaknesses
    const defaultGaps = [];
    if (turnoverGap) defaultGaps.push(turnoverGap);
    if (experienceGap) defaultGaps.push(experienceGap);
    if (missingCerts.length > 0) defaultGaps.push(`Missing required certifications: ${missingCerts.join(', ')}`);
    if (missingRegs.length > 0) defaultGaps.push(`Missing required registrations: ${missingRegs.join(', ')}`);

    const defaultStrengths = [];
    if (companyTurnover >= requiredTurnover && requiredTurnover > 0) {
      defaultStrengths.push(`Annual turnover ($${companyTurnover.toLocaleString()}) satisfies required threshold ($${requiredTurnover.toLocaleString()})`);
    }
    if (companyYears >= requiredYears && requiredYears > 0) {
      defaultStrengths.push(`${companyYears} years of domain experience meets requirement (${requiredYears} yrs)`);
    }
    if (complianceScore >= 75) {
      defaultStrengths.push(`Strong compliance readiness score (${complianceScore}/100)`);
    }
    if (isMSME) {
      defaultStrengths.push(`MSME/Startup status provides potential fee exemptions or eligibility relaxation`);
    }

    const defaultWeaknesses = [];
    if (riskImpactScore < 60) {
      defaultWeaknesses.push(`Overall contract risk score is ${overallRisk}/100 requiring active risk mitigation`);
    }
    if (financialFitScore < 70) {
      defaultWeaknesses.push(`Financial commitment (EMD + Performance BG) represents significant turnover ratio`);
    }
    if (!companySimilarExp) {
      defaultWeaknesses.push(`Lack of explicitly documented similar project experience`);
    }

    const defaultSummary = `${companyName} is advised to ${recommendation.toUpperCase()} this tender. Eligibility match score is ${eligibilityMatchScore}% with an estimated win probability of ${winProbability}%.`;

    // --- 9. CALL GEMINI AI FOR DECISION EXPLANATION ---
    let aiExplanation = {
      decisionSummary: defaultSummary,
      strengths: defaultStrengths,
      weaknesses: defaultWeaknesses,
      criticalGaps: defaultGaps
    };

    try {
      const majorRisksList = riskReport.topRisks || (riskReport.riskFactors || []).slice(0, 3).map(r => r.title || r);

      const promptInput = {
        companyName,
        tenderTitle: basicInfo.title || 'Procurement Tender',
        recommendation,
        winProbability,
        eligibilityMatchScore,
        riskImpactScore,
        financialFitScore,
        complianceScore,
        eligibilityFailure,
        keyMismatches: defaultGaps,
        majorRiskFactors: majorRisksList,
        companyProfileSummary: {
          turnover: companyTurnover,
          yearsExperience: companyYears,
          certificationsCount: companyCerts.length,
          isMSME
        },
        tenderRequirementsSummary: {
          requiredTurnover,
          requiredYears,
          estimatedValue: basicInfo.estimatedValue || 'Unstated'
        }
      };

      const systemPrompt = `You are TenderIQ's Chief Bid Evaluation Analyst.
Your task is to generate a concise, professional, and strictly factual decision briefing explaining WHY the system arrived at the computed bid recommendation ("${recommendation}").

STRICT RULES:
1. DO NOT HALLUCINATE: Base all explanations strictly on the provided score data, company profile, key mismatches, and risk factors.
2. CONCISE & PROFESSIONAL: Write clear, executive-level summaries suitable for C-suite procurement decision-makers.
3. EXPLAIN WHY: Clearly explain the specific drivers for the ${recommendation} recommendation, win probability (${winProbability}%), and score breakdown.
4. RETURN JSON ONLY: Match the exact JSON schema provided.`;

      const userPrompt = `EVALUATION INPUT DATA:
${JSON.stringify(promptInput, null, 2)}

Provide executive decisionSummary (2-3 sentences), key strengths (array of strings), weaknesses/liabilities (array of strings), and criticalGaps (array of strings).`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          decisionSummary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['decisionSummary', 'strengths', 'weaknesses', 'criticalGaps']
      };

      const response = await generateContentWithRetry({
        model: GEMINI_PRIMARY_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema
        }
      });

      if (response.text) {
        const parsed = parseSafeJson(response.text, {});
        if (parsed && typeof parsed.decisionSummary === 'string' && parsed.decisionSummary.length > 0) {
          aiExplanation = {
            decisionSummary: parsed.decisionSummary,
            strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : defaultStrengths,
            weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0 ? parsed.weaknesses : defaultWeaknesses,
            criticalGaps: Array.isArray(parsed.criticalGaps) ? parsed.criticalGaps : defaultGaps
          };
        }
      }
    } catch (err) {
      console.warn('Gemini Decision Engine explanation fallback:', err.message || err);
      // Retain default deterministic explanation
    }

    // Combine or preserve critical gaps if mandatory failures exist
    if (eligibilityFailure && aiExplanation.criticalGaps.length === 0) {
      aiExplanation.criticalGaps = defaultGaps;
    }

    // --- 10. FINAL MERGED API RESPONSE ---
    return {
      recommendation,
      winProbability,
      eligibilityMatchScore,
      riskImpactScore,
      financialFitScore,
      complianceScore,
      eligibilityFailure,
      confidence: 0.92,
      decisionSummary: aiExplanation.decisionSummary,
      strengths: aiExplanation.strengths,
      weaknesses: aiExplanation.weaknesses,
      criticalGaps: aiExplanation.criticalGaps,
      evaluatedAt: new Date().toISOString()
    };
  }
}
