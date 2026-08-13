import { GoogleGenAI, Type } from '@google/genai';

/**
 * Advanced Risk Intelligence Engine Service for TenderIQ
 * Performs evidence-backed, explainable risk assessment traceable to tender clauses.
 */
export class RiskIntelligenceService {
  /**
   * Main function to analyze risk for a tender
   * @param {Object} params
   * @param {string} params.tenderId
   * @param {Object} params.structuredAnalysis - The extracted procurement intelligence
   * @param {string} params.documentText - Raw text or key text chunks from tender
   * @returns {Promise<Object>} Structured Risk Intelligence Report
   */
  static async analyzeRisk({ tenderId, structuredAnalysis, documentText }) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY in Settings > Secrets.'
      );
    }

    if (!structuredAnalysis) {
      throw new Error('Structured tender analysis is required before running Risk Intelligence.');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const maxChars = 80000;
    const truncatedText = (documentText || '').length > maxChars
      ? documentText.substring(0, maxChars) + '\n\n[...Document truncated for AI risk evaluation...]'
      : (documentText || '');

    const systemPrompt = `You are TenderIQ's Enterprise Risk Intelligence Engine.
Your task is to conduct an evidence-backed, explainable, and rigorous risk assessment of the provided tender document and structured procurement intelligence.

STRICT RISK EVALUATION & SAFETY RULES:
1. EVIDENCE-BASED ASSESSMENT:
   - EVERY reported risk factor, red flag, or penalty MUST be grounded directly in exact tender clauses or extracted requirements.
   - NEVER invent or fabricate clauses, penalties, financial figures, or risk conditions.
   - If evidence is insufficient or unstated in the document for a specific factor, DO NOT claim a confirmed risk; mark as "Insufficient evidence".
2. SEVERITY DIFFERENTIATION:
   - Low: Minor administrative requirement or standard condition.
   - Medium: Moderate requirement that demands planning but is achievable.
   - High: Difficult or restrictive condition that can materially impair eligibility, cash flow, or operations.
   - Critical: Extreme condition involving catastrophic financial exposure, immediate blacklisting/disqualification risks, or impossible delivery terms.
3. BALANCED EVALUATION:
   - Identify both Risk Factors AND Positive Signals (e.g. transparent criteria, reasonable payment terms, MSME/Startup exemptions, fair SLA grace periods).
4. FINANCIAL EXPOSURE & PENALTY CALCULATION:
   - Explicitly distinguish between "Explicitly Stated" values (e.g., EMD = $48,000) vs "Derived from stated tender values" (e.g., 10% BG = $240,000 derived from $2.4M estimated budget).
   - If a numerical value is unstated, DO NOT calculate or fabricate one.
5. EXPLAINABILITY:
   - For every risk factor, explain clearly "Why is this risky?" in practical commercial/operational terms for a bidder.

Return ONLY a valid JSON object strictly matching the requested schema.`;

    const userPrompt = `TENDER ANALYSIS SUMMARY:
${JSON.stringify(structuredAnalysis, null, 2)}

ORIGINAL TENDER DOCUMENT TEXT:
"""
${truncatedText}
"""

Evaluate financial, legal/contractual, operational, eligibility, and compliance risks, penalties, financial exposure, red flags, and positive signals according to the schema.`;

    // Schema definitions
    const sourceTraceSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        category: { type: Type.STRING }, // "financial" | "legal" | "operational" | "eligibility" | "compliance"
        severity: { type: Type.STRING }, // "low" | "medium" | "high" | "critical"
        scoreImpact: { type: Type.NUMBER }, // e.g. 10, 15, 25
        explanation: { type: Type.STRING }, // Why is this risky?
        sourceText: { type: Type.STRING },
        section: { type: Type.STRING },
        page: { type: Type.INTEGER },
        confidence: { type: Type.NUMBER }
      }
    };

    const categoryScoreSchema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER }, // 0 to 100
        level: { type: Type.STRING }, // "Very Low" | "Low" | "Moderate" | "High" | "Critical"
        summary: { type: Type.STRING },
        majorFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    };

    const penaltyItemSchema = {
      type: Type.OBJECT,
      properties: {
        penaltyType: { type: Type.STRING }, // "Liquidated Damages", "Delay Penalty", "SLA Breach", "Termination", "Debarment/Blacklisting", "Security Forfeiture"
        trigger: { type: Type.STRING },
        financialConsequence: { type: Type.STRING },
        sourceText: { type: Type.STRING },
        section: { type: Type.STRING },
        page: { type: Type.INTEGER },
        confidence: { type: Type.NUMBER }
      }
    };

    const financialExposureItemSchema = {
      type: Type.OBJECT,
      properties: {
        commitmentName: { type: Type.STRING }, // EMD, Tender Fee, Performance BG, Security Deposit, Retention
        amount: { type: Type.STRING },
        derivationType: { type: Type.STRING }, // "Explicitly Stated" | "Derived from stated tender values"
        paymentDeadline: { type: Type.STRING },
        refundability: { type: Type.STRING },
        sourceText: { type: Type.STRING },
        section: { type: Type.STRING },
        page: { type: Type.INTEGER },
        confidence: { type: Type.NUMBER }
      }
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.NUMBER },
        overallLevel: { type: Type.STRING }, // "Very Low" | "Low" | "Moderate" | "High" | "Critical"
        executiveSummary: { type: Type.STRING },
        categoryScores: {
          type: Type.OBJECT,
          properties: {
            financialRisk: categoryScoreSchema,
            legalRisk: categoryScoreSchema,
            operationalRisk: categoryScoreSchema,
            eligibilityRisk: categoryScoreSchema,
            complianceRisk: categoryScoreSchema
          }
        },
        riskFactors: {
          type: Type.ARRAY,
          items: sourceTraceSchema
        },
        redFlags: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              severity: { type: Type.STRING },
              explanation: { type: Type.STRING },
              sourceText: { type: Type.STRING },
              section: { type: Type.STRING },
              page: { type: Type.INTEGER },
              confidence: { type: Type.NUMBER }
            }
          }
        },
        positiveSignals: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              explanation: { type: Type.STRING },
              sourceText: { type: Type.STRING },
              section: { type: Type.STRING },
              page: { type: Type.INTEGER },
              confidence: { type: Type.NUMBER }
            }
          }
        },
        penaltyAnalysis: {
          type: Type.OBJECT,
          properties: {
            liquidatedDamages: penaltyItemSchema,
            delayPenalties: penaltyItemSchema,
            slaBreachPenalties: penaltyItemSchema,
            terminationConsequences: penaltyItemSchema,
            blacklistingRules: penaltyItemSchema,
            securityForfeiture: penaltyItemSchema,
            otherPenalties: { type: Type.ARRAY, items: penaltyItemSchema }
          }
        },
        financialExposure: {
          type: Type.OBJECT,
          properties: {
            totalEstimatedCommitment: { type: Type.STRING },
            emd: financialExposureItemSchema,
            tenderFee: financialExposureItemSchema,
            performanceSecurity: financialExposureItemSchema,
            securityDeposit: financialExposureItemSchema,
            retentionAmount: financialExposureItemSchema,
            exposureSummary: { type: Type.STRING }
          }
        },
        topRisks: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        topPositiveSignals: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        recommendedAreasToInvestigate: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema
        }
      });

      const responseText = response.text ? response.text.trim() : '';
      if (!responseText) {
        throw new Error('Received empty response from Gemini AI risk model.');
      }

      const cleanedJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const parsedData = JSON.parse(cleanedJson);
      return RiskIntelligenceService.normalizeRiskReport(parsedData, structuredAnalysis);

    } catch (err) {
      console.error('RiskIntelligenceService execution error:', err);
      const cleanErr = err.message ? err.message.replace(/key=[^&]+/gi, 'key=HIDDEN') : 'Risk calculation error.';
      throw new Error(`Risk Intelligence evaluation failed: ${cleanErr}`);
    }
  }

  /**
   * Helper to classify a numeric score into a level string
   */
  static getRiskLevel(score) {
    if (score <= 20) return 'Very Low';
    if (score <= 40) return 'Low';
    if (score <= 60) return 'Moderate';
    if (score <= 80) return 'High';
    return 'Critical';
  }

  /**
   * Normalizes raw AI output into a guaranteed, clean Risk Intelligence Report structure
   */
  static normalizeRiskReport(data = {}, structuredAnalysis = {}) {
    const rawFactors = Array.isArray(data.riskFactors) ? data.riskFactors : [];

    const normFactor = (f) => {
      if (!f || !f.title) return null;
      return {
        title: String(f.title),
        category: (f.category || 'general').toLowerCase(),
        severity: (f.severity || 'medium').toLowerCase(),
        scoreImpact: typeof f.scoreImpact === 'number' ? f.scoreImpact : 10,
        explanation: f.explanation || 'Potential contractual or operational risk identified.',
        sourceText: f.sourceText || f.source || null,
        section: f.section || null,
        page: Number.isInteger(f.page) ? f.page : null,
        confidence: typeof f.confidence === 'number' ? Math.min(1.0, Math.max(0, f.confidence)) : 0.90
      };
    };

    const riskFactors = rawFactors.map(normFactor).filter(Boolean);

    // Calculate score dynamically if missing or default
    let calculatedScore = typeof data.overallScore === 'number' ? Math.round(data.overallScore) : null;
    if (calculatedScore === null || isNaN(calculatedScore)) {
      // Base score derived from critical/high factors
      let scoreSum = 25; // baseline moderate
      riskFactors.forEach(f => {
        if (f.severity === 'critical') scoreSum += 25;
        else if (f.severity === 'high') scoreSum += 15;
        else if (f.severity === 'medium') scoreSum += 8;
        else if (f.severity === 'low') scoreSum += 3;
      });
      calculatedScore = Math.min(100, Math.max(10, scoreSum));
    }

    const overallLevel = RiskIntelligenceService.getRiskLevel(calculatedScore);

    // Normalize Category Scores
    const rawCategories = data.categoryScores || {};
    const normCategory = (catData, defaultScore = 30) => {
      const score = typeof catData?.score === 'number' ? Math.round(catData.score) : defaultScore;
      return {
        score,
        level: RiskIntelligenceService.getRiskLevel(score),
        summary: catData?.summary || 'Standard risk profile for this evaluation category.',
        majorFactors: Array.isArray(catData?.majorFactors) ? catData.majorFactors : []
      };
    };

    const categoryScores = {
      financialRisk: normCategory(rawCategories.financialRisk, Math.min(100, calculatedScore + 5)),
      legalRisk: normCategory(rawCategories.legalRisk, Math.min(100, calculatedScore + 10)),
      operationalRisk: normCategory(rawCategories.operationalRisk, Math.max(10, calculatedScore - 10)),
      eligibilityRisk: normCategory(rawCategories.eligibilityRisk, Math.max(10, calculatedScore - 5)),
      complianceRisk: normCategory(rawCategories.complianceRisk, Math.max(10, calculatedScore - 15))
    };

    // Normalize Red Flags
    const redFlags = Array.isArray(data.redFlags)
      ? data.redFlags.map(rf => ({
          title: rf.title || 'Significant Risk Clause Detected',
          severity: (rf.severity || 'high').toLowerCase(),
          explanation: rf.explanation || 'Clause poses notable contractual risk.',
          sourceText: rf.sourceText || rf.source || null,
          section: rf.section || null,
          page: Number.isInteger(rf.page) ? rf.page : null,
          confidence: typeof rf.confidence === 'number' ? rf.confidence : 0.92
        }))
      : [];

    // Normalize Positive Signals
    const positiveSignals = Array.isArray(data.positiveSignals)
      ? data.positiveSignals.map(ps => ({
          title: ps.title || 'Favorable Condition',
          explanation: ps.explanation || 'Clause aligns with standard vendor-friendly practices.',
          sourceText: ps.sourceText || ps.source || null,
          section: ps.section || null,
          page: Number.isInteger(ps.page) ? ps.page : null,
          confidence: typeof ps.confidence === 'number' ? ps.confidence : 0.95
        }))
      : [];

    // Normalize Penalty Analysis
    const normPenalty = (p, defaultType) => {
      if (!p) return null;
      return {
        penaltyType: p.penaltyType || defaultType,
        trigger: p.trigger || 'Clause breach or milestone delay',
        financialConsequence: p.financialConsequence || 'As specified in clause',
        sourceText: p.sourceText || p.source || null,
        section: p.section || null,
        page: Number.isInteger(p.page) ? p.page : null,
        confidence: typeof p.confidence === 'number' ? p.confidence : 0.90
      };
    };

    const penaltyAnalysis = {
      liquidatedDamages: normPenalty(data.penaltyAnalysis?.liquidatedDamages, 'Liquidated Damages'),
      delayPenalties: normPenalty(data.penaltyAnalysis?.delayPenalties, 'Delay Penalties'),
      slaBreachPenalties: normPenalty(data.penaltyAnalysis?.slaBreachPenalties, 'SLA Breach Penalties'),
      terminationConsequences: normPenalty(data.penaltyAnalysis?.terminationConsequences, 'Termination Consequences'),
      blacklistingRules: normPenalty(data.penaltyAnalysis?.blacklistingRules, 'Debarment & Blacklisting'),
      securityForfeiture: normPenalty(data.penaltyAnalysis?.securityForfeiture, 'Security Forfeiture'),
      otherPenalties: Array.isArray(data.penaltyAnalysis?.otherPenalties)
        ? data.penaltyAnalysis.otherPenalties.map(p => normPenalty(p, 'Other Penalty')).filter(Boolean)
        : []
    };

    // Normalize Financial Exposure
    const normExposure = (fe, defaultName) => {
      if (!fe) return null;
      return {
        commitmentName: fe.commitmentName || defaultName,
        amount: fe.amount || 'Unstated',
        derivationType: fe.derivationType || 'Explicitly Stated',
        paymentDeadline: fe.paymentDeadline || 'Upon bid submission',
        refundability: fe.refundability || 'Subject to tender terms',
        sourceText: fe.sourceText || fe.source || null,
        section: fe.section || null,
        page: Number.isInteger(fe.page) ? fe.page : null,
        confidence: typeof fe.confidence === 'number' ? fe.confidence : 0.90
      };
    };

    const financialExposure = {
      totalEstimatedCommitment: data.financialExposure?.totalEstimatedCommitment || 'Calculated from stated requirements',
      emd: normExposure(data.financialExposure?.emd, 'Earnest Money Deposit (EMD)'),
      tenderFee: normExposure(data.financialExposure?.tenderFee, 'Tender Document Fee'),
      performanceSecurity: normExposure(data.financialExposure?.performanceSecurity, 'Performance Security BG'),
      securityDeposit: normExposure(data.financialExposure?.securityDeposit, 'Security Deposit'),
      retentionAmount: normExposure(data.financialExposure?.retentionAmount, 'Retention Amount'),
      exposureSummary: data.financialExposure?.exposureSummary || 'Financial exposure includes mandatory upfront EMD and performance bank guarantee commitments.'
    };

    // Top Lists
    const topRisks = Array.isArray(data.topRisks) && data.topRisks.length > 0
      ? data.topRisks
      : riskFactors.slice(0, 3).map(r => r.title);

    const topPositiveSignals = Array.isArray(data.topPositiveSignals) && data.topPositiveSignals.length > 0
      ? data.topPositiveSignals
      : positiveSignals.slice(0, 3).map(p => p.title);

    const recommendedAreasToInvestigate = Array.isArray(data.recommendedAreasToInvestigate) && data.recommendedAreasToInvestigate.length > 0
      ? data.recommendedAreasToInvestigate
      : [
          'Review liquidated damages cap and delay grace period terms.',
          'Verify bank guarantee issuance timeline with finance partners.',
          'Clarify ambiguity in technical specification SLAs during pre-bid.'
        ];

    return {
      overallScore: calculatedScore,
      overallLevel,
      executiveSummary: data.executiveSummary || `The tender presents a ${overallLevel} risk profile (Score: ${calculatedScore}/100), primarily driven by performance security and SLA penalty clauses.`,
      categoryScores,
      riskFactors,
      redFlags,
      positiveSignals,
      penaltyAnalysis,
      financialExposure,
      topRisks,
      topPositiveSignals,
      recommendedAreasToInvestigate
    };
  }
}
