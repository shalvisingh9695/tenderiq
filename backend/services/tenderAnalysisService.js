<<<<<<< HEAD
import { generateContentWithRetry, GEMINI_PRIMARY_MODEL, Type } from '../config/gemini.js';
import { parseSafeJson } from '../utils/jsonHelper.js';
import { HeuristicExtractor } from './heuristicExtractor.js';

/**
 * Tender Analysis Service using Gemini API
 * Analyzes document text and converts it into source-traceable procurement intelligence
 * with PDF page numbers, sections, and approximate positions.
=======
import { GoogleGenAI, Type } from '@google/genai';

/**
 * Tender Analysis Service using Gemini API
 * Analyzes document text and converts it into source-traceable procurement intelligence.
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
 */
export class TenderAnalysisService {
  /**
   * Main function to analyze extracted tender text
   * @param {string} documentText - Raw text extracted from PDF/DOCX/TXT
   * @param {Object} metadata - File metadata (name, extension, etc.)
   * @returns {Promise<Object>} Normalized structured tender analysis
   */
  static async analyzeTenderText(documentText, metadata = {}) {
<<<<<<< HEAD
=======
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY in Settings > Secrets.'
      );
    }

>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('No text content was found in the uploaded document to analyze.');
    }

    // Limit text length if extremely massive (>100k chars) to fit context comfortably
    const maxChars = 100000;
    const truncatedText = documentText.length > maxChars 
      ? documentText.substring(0, maxChars) + '\n\n[...Document truncated for AI analysis...]'
      : documentText;

<<<<<<< HEAD
    const systemPrompt = `You are TenderIQ's Enterprise Procurement Intelligence Extraction Engine.
Your task is to analyze the provided tender/RFP document text and extract structured procurement data with exact source traceability including page references, sections, and approximate positions.
=======
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemPrompt = `You are TenderIQ's Enterprise Procurement Intelligence Extraction Engine.
Your task is to analyze the provided tender/RFP document text and extract structured procurement data with exact source traceability.
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

STRICT EXTRACTION & ACCURACY RULES:
1. EXPLICIT VS CONDITIONAL VS OPTIONAL VS AMBIGUOUS:
   - Mark a requirement as "explicit" ONLY if the document explicitly states it is mandatory (e.g., "must", "shall", "mandatory").
   - Mark as "conditional" if it applies under specific circumstances (e.g., "if JV partner exists", "where applicable", "for foreign bidders").
   - Mark as "optional" if it is voluntary or recommended ("may submit", "desirable").
   - Mark as "ambiguous" if the clause language is unclear, vague, or open to interpretation.
2. DO NOT FABRICATE OR CALCULATE:
   - NEVER invent missing values or calculate unstated amounts.
   - NEVER assume a requirement exists if not stated in the document.
   - NEVER convert ambiguous language into a definite requirement.
3. NUMERICAL & CURRENCY ACCURACY:
   - Preserve original currency (₹, USD, EUR, etc.) and numerical units (Lakhs, Crores, Millions, %, days, years) EXACTLY as written.
<<<<<<< HEAD
4. SOURCE TRACEABILITY, PAGE NUMBERS & POSITIONS:
=======
   - DO NOT convert ₹5 Crore to ₹5 Lakh or 10% to 10.
4. SOURCE TRACEABILITY & PAGE NUMBERS:
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
   - For every extracted field, include:
     * "value": The extracted requirement value or text.
     * "sourceText": The exact sentence or clause snippet from the tender document.
     * "section": The section name or heading where the clause appears (e.g., "Section 3.1 Eligibility").
<<<<<<< HEAD
     * "page": Integer page number ONLY if explicitly indicated in text or header/footer. Otherwise set to null. NEVER fabricate page numbers.
     * "approximatePosition": Position description (e.g., "Page 1, Section 3.1" or "Top 15% of document").
     * "confidence": Float between 0.0 and 1.0 representing extraction confidence.
     * "relevance": Float between 0.0 and 1.0 representing relevance score.
5. DEADLINES:
   - Categorize dates into types: "publication", "preBid", "clarificationDeadline", "submissionStart", "submissionDeadline", "technicalOpening", "financialOpening", "other".
   - Store "originalText" and "normalizedDate" (YYYY-MM-DD if parseable).
6. MANDATORY DOCUMENTS:
   - Identify every required document, category, mandatory status, and source page/section metadata.

Return ONLY a valid JSON object matching the following structure:
{
  "basicInformation": {
    "title": "string", "referenceId": "string", "procuringAuthority": "string", "department": "string",
    "tenderType": "string", "procurementCategory": "string", "location": "string", "estimatedValue": "string",
    "currency": "string", "status": "string"
  },
  "importantDates": [
    { "type": "string", "label": "string", "originalText": "string", "normalizedDate": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9 }
  ],
  "eligibility": {
    "annualTurnover": { "value": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9, "requirementType": "explicit", "isAmbiguous": false },
    "netWorth": { "value": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9, "requirementType": "explicit", "isAmbiguous": false },
    "yearsOfExperience": { "value": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9, "requirementType": "explicit", "isAmbiguous": false },
    "similarWorkExperience": { "value": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9, "requirementType": "explicit", "isAmbiguous": false },
    "technicalQualifications": [],
    "requiredCertifications": [],
    "requiredRegistrations": [],
    "requiredLicenses": [],
    "oemRequirements": null,
    "msmeConditions": null,
    "consortiumConditions": null,
    "geographicEligibility": null,
    "otherConditions": []
  },
  "financialRequirements": {
    "emd": { "value": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9, "requirementType": "explicit", "isAmbiguous": false },
    "tenderFee": { "value": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9, "requirementType": "explicit", "isAmbiguous": false },
    "performanceSecurity": { "value": "string", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9, "requirementType": "explicit", "isAmbiguous": false },
    "securityDeposit": null,
    "bankGuarantee": null,
    "paymentTerms": null,
    "otherThresholds": []
  },
  "technicalRequirements": {
    "scopeOfWork": null,
    "technicalSpecifications": [],
    "minimumManpower": null,
    "equipmentRequirements": [],
    "infrastructureRequirements": null,
    "technologyRequirements": [],
    "serviceLevelRequirements": [],
    "deliveryRequirements": null,
    "qualityStandards": [],
    "experienceRequirements": []
  },
  "mandatoryDocuments": [
    { "documentName": "string", "category": "string", "mandatory": true, "conditional": false, "requirementType": "mandatory", "sourceText": "string", "section": "string", "page": null, "approximatePosition": "string", "confidence": 0.9, "relevance": 0.9 }
  ],
  "commercialTerms": {
    "contractDuration": null,
    "renewalConditions": null,
    "paymentSchedule": null,
    "warrantyRequirements": null,
    "maintenanceRequirements": null,
    "deliverySchedule": null,
    "liquidatedDamages": null,
    "penalties": null,
    "terminationConditions": null,
    "blacklistingConditions": null,
    "disputeResolution": null,
    "arbitration": null,
    "forceMajeure": null,
    "otherObligations": []
  },
  "ambiguousClauses": []
}`;
=======
     * "page": Integer page number ONLY if explicitly indicated in text (e.g. "Page 14" or header/footer marker). Otherwise set to null. NEVER fabricate page numbers.
     * "confidence": Float between 0.0 and 1.0 representing extraction confidence (0.90+ High, 0.70-0.89 Medium, <0.70 Low).
5. DEADLINES:
   - Categorize dates into types: "publication", "preBid", "clarificationDeadline", "submissionStart", "submissionDeadline", "technicalOpening", "financialOpening", "other".
   - Store "originalText" (e.g., "30th Sept 2026 at 5:00 PM") and "normalizedDate" (YYYY-MM-DD if safely parseable, otherwise null).
6. MANDATORY DOCUMENTS:
   - Identify every required document, its category (Legal, Financial, Technical, Experience, Certification, Registration, Declarations, Other), whether it is mandatory vs conditional, and requirement status ("must_submit", "may_submit", "where_applicable").

Return ONLY a valid JSON object matching the requested schema without markdown formatting or commentary.`;
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

    const userPrompt = `Document Title/Filename: ${metadata.name || 'Tender Document'}

TENDER DOCUMENT TEXT:
"""
${truncatedText}
"""

<<<<<<< HEAD
Extract structured procurement data according to the requested JSON schema.`;

    try {
      const response = await generateContentWithRetry({
        model: GEMINI_PRIMARY_MODEL,
=======
Extract structured procurement data according to the schema.`;

    // Reusable SourceTraceable schema item
    const sourceTraceableSchema = {
      type: Type.OBJECT,
      properties: {
        value: { type: Type.STRING },
        sourceText: { type: Type.STRING },
        section: { type: Type.STRING },
        page: { type: Type.INTEGER },
        confidence: { type: Type.NUMBER },
        requirementType: { type: Type.STRING }, // "explicit" | "conditional" | "optional" | "ambiguous"
        isAmbiguous: { type: Type.BOOLEAN }
      }
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        basicInformation: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            referenceId: { type: Type.STRING },
            procuringAuthority: { type: Type.STRING },
            department: { type: Type.STRING },
            tenderType: { type: Type.STRING },
            procurementCategory: { type: Type.STRING },
            location: { type: Type.STRING },
            estimatedValue: { type: Type.STRING },
            currency: { type: Type.STRING },
            status: { type: Type.STRING }
          }
        },
        importantDates: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              label: { type: Type.STRING },
              originalText: { type: Type.STRING },
              normalizedDate: { type: Type.STRING },
              sourceText: { type: Type.STRING },
              section: { type: Type.STRING },
              page: { type: Type.INTEGER },
              confidence: { type: Type.NUMBER }
            }
          }
        },
        eligibility: {
          type: Type.OBJECT,
          properties: {
            annualTurnover: sourceTraceableSchema,
            netWorth: sourceTraceableSchema,
            yearsOfExperience: sourceTraceableSchema,
            similarWorkExperience: sourceTraceableSchema,
            technicalQualifications: { type: Type.ARRAY, items: sourceTraceableSchema },
            requiredCertifications: { type: Type.ARRAY, items: sourceTraceableSchema },
            requiredRegistrations: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredLicenses: { type: Type.ARRAY, items: { type: Type.STRING } },
            oemRequirements: sourceTraceableSchema,
            msmeConditions: sourceTraceableSchema,
            consortiumConditions: sourceTraceableSchema,
            geographicEligibility: sourceTraceableSchema,
            otherConditions: { type: Type.ARRAY, items: sourceTraceableSchema }
          }
        },
        financialRequirements: {
          type: Type.OBJECT,
          properties: {
            emd: sourceTraceableSchema,
            tenderFee: sourceTraceableSchema,
            performanceSecurity: sourceTraceableSchema,
            securityDeposit: sourceTraceableSchema,
            bankGuarantee: sourceTraceableSchema,
            paymentTerms: sourceTraceableSchema,
            otherThresholds: { type: Type.ARRAY, items: sourceTraceableSchema }
          }
        },
        technicalRequirements: {
          type: Type.OBJECT,
          properties: {
            scopeOfWork: sourceTraceableSchema,
            technicalSpecifications: { type: Type.ARRAY, items: sourceTraceableSchema },
            minimumManpower: sourceTraceableSchema,
            equipmentRequirements: { type: Type.ARRAY, items: sourceTraceableSchema },
            infrastructureRequirements: sourceTraceableSchema,
            technologyRequirements: { type: Type.ARRAY, items: sourceTraceableSchema },
            serviceLevelRequirements: { type: Type.ARRAY, items: sourceTraceableSchema },
            deliveryRequirements: sourceTraceableSchema,
            qualityStandards: { type: Type.ARRAY, items: sourceTraceableSchema },
            experienceRequirements: { type: Type.ARRAY, items: sourceTraceableSchema }
          }
        },
        mandatoryDocuments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              documentName: { type: Type.STRING },
              category: { type: Type.STRING },
              mandatory: { type: Type.BOOLEAN },
              conditional: { type: Type.BOOLEAN },
              requirementType: { type: Type.STRING },
              sourceText: { type: Type.STRING },
              section: { type: Type.STRING },
              page: { type: Type.INTEGER },
              confidence: { type: Type.NUMBER }
            }
          }
        },
        commercialTerms: {
          type: Type.OBJECT,
          properties: {
            contractDuration: sourceTraceableSchema,
            renewalConditions: sourceTraceableSchema,
            paymentSchedule: sourceTraceableSchema,
            warrantyRequirements: sourceTraceableSchema,
            maintenanceRequirements: sourceTraceableSchema,
            deliverySchedule: sourceTraceableSchema,
            liquidatedDamages: sourceTraceableSchema,
            penalties: sourceTraceableSchema,
            terminationConditions: sourceTraceableSchema,
            blacklistingConditions: sourceTraceableSchema,
            disputeResolution: sourceTraceableSchema,
            arbitration: sourceTraceableSchema,
            forceMajeure: sourceTraceableSchema,
            otherObligations: { type: Type.ARRAY, items: sourceTraceableSchema }
          }
        },
        ambiguousClauses: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              clauseText: { type: Type.STRING },
              section: { type: Type.STRING },
              page: { type: Type.INTEGER },
              ambiguityReason: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            }
          }
        }
      }
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.1,
<<<<<<< HEAD
          responseMimeType: 'application/json'
=======
          responseMimeType: 'application/json',
          responseSchema
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
        }
      });

      const responseText = response.text ? response.text.trim() : '';
      if (!responseText) {
        throw new Error('Received an empty response from Gemini AI model.');
      }

<<<<<<< HEAD
      const parsedData = parseSafeJson(responseText);
      return TenderAnalysisService.normalizeAnalysisResult(parsedData);

    } catch (err) {
      console.warn('TenderAnalysisService Gemini AI warning:', err.message || err);
      
      // If Gemini hit 429 rate limit or transient error, seamlessly fallback to Heuristic Extraction
      console.info('[TenderAnalysisService] Running intelligent rule-based / heuristic extractor fallback...');
      try {
        const heuristicData = HeuristicExtractor.extractFromText(documentText, metadata);
        const normalized = TenderAnalysisService.normalizeAnalysisResult(heuristicData);
        normalized.metadata = {
          ...(normalized.metadata || {}),
          extractionMode: 'heuristic-rule-based',
          aiRateLimited: true,
          note: 'Extracted via high-accuracy rule-based engine due to temporary AI rate limit window.'
        };
        return normalized;
      } catch (fallbackErr) {
        console.error('Heuristic fallback failed:', fallbackErr);
        const cleanErr = err.userMessage || (err.message ? err.message.replace(/key=[^&]+/gi, 'key=HIDDEN') : 'AI analysis error.');
        const finalErr = new Error(`AI Extraction failed: ${cleanErr}`);
        finalErr.status = err.status || 500;
        throw finalErr;
      }
=======
      const cleanedJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      let parsedData;
      try {
        parsedData = JSON.parse(cleanedJson);
      } catch (parseErr) {
        console.error('Failed to parse AI response as JSON:', parseErr, responseText);
        throw new Error('AI returned an invalid JSON response format.');
      }

      return TenderAnalysisService.normalizeAnalysisResult(parsedData);

    } catch (err) {
      console.error('TenderAnalysisService execution error:', err);
      const cleanErr = err.message ? err.message.replace(/key=[^&]+/gi, 'key=HIDDEN') : 'AI analysis error.';
      throw new Error(`AI Extraction failed: ${cleanErr}`);
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    }
  }

  /**
   * Normalizes any object/string into a consistent SourceTraceable object
<<<<<<< HEAD
   * containing text, relevance, page, section, and approximatePosition.
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
   */
  static normalizeSourceItem(item) {
    if (!item) return null;
    if (typeof item === 'string') {
      return {
        value: item,
        sourceText: null,
        section: null,
        page: null,
<<<<<<< HEAD
        approximatePosition: null,
        confidence: 0.90,
        relevance: 0.90,
=======
        confidence: 0.90,
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
        requirementType: 'explicit',
        isAmbiguous: false
      };
    }

    const value = item.value || item.text || item.description || null;
    if (!value) return null;

    let pageVal = null;
    if (Number.isInteger(item.page)) pageVal = item.page;
    else if (Number.isInteger(item.pageNumber)) pageVal = item.pageNumber;

    let conf = 0.90;
    if (typeof item.confidence === 'number') {
      conf = Math.min(1.0, Math.max(0.0, item.confidence));
    }

<<<<<<< HEAD
    let rel = conf;
    if (typeof item.relevance === 'number') {
      rel = Math.min(1.0, Math.max(0.0, item.relevance));
    }

    const sectionVal = item.section || item.sectionHeading || null;
    let approxPos = item.approximatePosition || null;

    if (!approxPos) {
      if (pageVal && sectionVal) {
        approxPos = `Page ${pageVal} (${sectionVal})`;
      } else if (pageVal) {
        approxPos = `Page ${pageVal}`;
      } else if (sectionVal) {
        approxPos = sectionVal;
      }
    }

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    const reqType = item.requirementType || (item.mandatory === false ? 'conditional' : 'explicit');
    const isAmbiguous = Boolean(item.isAmbiguous || reqType === 'ambiguous');

    return {
      value: String(value),
      sourceText: item.sourceText || item.source || item.snippet || null,
<<<<<<< HEAD
      section: sectionVal,
      page: pageVal,
      approximatePosition: approxPos,
      confidence: conf,
      relevance: rel,
=======
      section: item.section || item.sectionHeading || null,
      page: pageVal,
      confidence: conf,
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      requirementType: reqType,
      isAmbiguous
    };
  }

  /**
   * Safe normalization layer ensuring missing fields are null or empty arrays,
   * dates are properly typed, documents are mapped, and health metrics are calculated.
   */
  static normalizeAnalysisResult(data = {}) {
    const norm = TenderAnalysisService.normalizeSourceItem;

    // 1. Basic Information
    const basicInformation = {
      title: data.basicInformation?.title || 'Tender Document',
      referenceId: data.basicInformation?.referenceId || null,
      procuringAuthority: data.basicInformation?.procuringAuthority || null,
      department: data.basicInformation?.department || null,
      tenderType: data.basicInformation?.tenderType || 'Open Tender',
      procurementCategory: data.basicInformation?.procurementCategory || 'Procurement',
      location: data.basicInformation?.location || null,
      estimatedValue: data.basicInformation?.estimatedValue || null,
      currency: data.basicInformation?.currency || null,
      status: data.basicInformation?.status || 'Open'
    };

    // 2. Important Dates
    const importantDates = Array.isArray(data.importantDates)
      ? data.importantDates.map((d) => {
          let normalizedDate = d.normalizedDate || d.dateString || null;
          if (normalizedDate && !/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
            const parsed = new Date(normalizedDate);
            if (!isNaN(parsed.getTime())) {
              normalizedDate = parsed.toISOString().split('T')[0];
            } else {
              normalizedDate = null;
            }
          }

          let pageVal = null;
          if (Number.isInteger(d.page)) pageVal = d.page;

<<<<<<< HEAD
          const sectionVal = d.section || null;
          let approxPos = d.approximatePosition || null;
          if (!approxPos) {
            if (pageVal && sectionVal) approxPos = `Page ${pageVal} (${sectionVal})`;
            else if (pageVal) approxPos = `Page ${pageVal}`;
            else if (sectionVal) approxPos = sectionVal;
          }

          const conf = typeof d.confidence === 'number' ? Math.min(1.0, Math.max(0, d.confidence)) : 0.90;
          const rel = typeof d.relevance === 'number' ? Math.min(1.0, Math.max(0, d.relevance)) : conf;

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          return {
            type: d.type || 'other',
            label: d.label || 'Key Date',
            originalText: d.originalText || d.originalWording || d.dateString || 'Unspecified',
            normalizedDate,
            sourceText: d.sourceText || d.source || null,
<<<<<<< HEAD
            section: sectionVal,
            page: pageVal,
            approximatePosition: approxPos,
            confidence: conf,
            relevance: rel
=======
            section: d.section || null,
            page: pageVal,
            confidence: typeof d.confidence === 'number' ? Math.min(1.0, Math.max(0, d.confidence)) : 0.90
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          };
        })
      : [];

    // 3. Eligibility
    const rawEligibility = data.eligibility || {};
    const eligibility = {
      annualTurnover: norm(rawEligibility.annualTurnover),
      netWorth: norm(rawEligibility.netWorth),
      yearsOfExperience: norm(rawEligibility.yearsOfExperience),
      similarWorkExperience: norm(rawEligibility.similarWorkExperience),
      technicalQualifications: Array.isArray(rawEligibility.technicalQualifications)
        ? rawEligibility.technicalQualifications.map(norm).filter(Boolean)
        : [],
      requiredCertifications: Array.isArray(rawEligibility.requiredCertifications)
        ? rawEligibility.requiredCertifications.map(norm).filter(Boolean)
        : [],
      requiredRegistrations: Array.isArray(rawEligibility.requiredRegistrations)
        ? rawEligibility.requiredRegistrations.map(r => typeof r === 'string' ? r : r?.value).filter(Boolean)
        : [],
      requiredLicenses: Array.isArray(rawEligibility.requiredLicenses)
        ? rawEligibility.requiredLicenses.map(l => typeof l === 'string' ? l : l?.value).filter(Boolean)
        : [],
      oemRequirements: norm(rawEligibility.oemRequirements),
      msmeConditions: norm(rawEligibility.msmeConditions),
      consortiumConditions: norm(rawEligibility.consortiumConditions),
      geographicEligibility: norm(rawEligibility.geographicEligibility),
      otherConditions: Array.isArray(rawEligibility.otherConditions)
        ? rawEligibility.otherConditions.map(norm).filter(Boolean)
        : []
    };

    // 4. Financial Requirements
    const rawFin = data.financialRequirements || {};
    const financialRequirements = {
      emd: norm(rawFin.emd),
      tenderFee: norm(rawFin.tenderFee),
      performanceSecurity: norm(rawFin.performanceSecurity),
      securityDeposit: norm(rawFin.securityDeposit),
      bankGuarantee: norm(rawFin.bankGuarantee),
      paymentTerms: norm(rawFin.paymentTerms),
      otherThresholds: Array.isArray(rawFin.otherThresholds)
        ? rawFin.otherThresholds.map(norm).filter(Boolean)
        : []
    };

    // 5. Technical Requirements
    const rawTech = data.technicalRequirements || {};
    const technicalRequirements = {
      scopeOfWork: norm(rawTech.scopeOfWork),
      technicalSpecifications: Array.isArray(rawTech.technicalSpecifications)
        ? rawTech.technicalSpecifications.map(norm).filter(Boolean)
        : [],
      minimumManpower: norm(rawTech.minimumManpower),
      equipmentRequirements: Array.isArray(rawTech.equipmentRequirements)
        ? rawTech.equipmentRequirements.map(norm).filter(Boolean)
        : [],
      infrastructureRequirements: norm(rawTech.infrastructureRequirements),
      technologyRequirements: Array.isArray(rawTech.technologyRequirements)
        ? rawTech.technologyRequirements.map(norm).filter(Boolean)
        : [],
      serviceLevelRequirements: Array.isArray(rawTech.serviceLevelRequirements)
        ? rawTech.serviceLevelRequirements.map(norm).filter(Boolean)
        : [],
      deliveryRequirements: norm(rawTech.deliveryRequirements),
      qualityStandards: Array.isArray(rawTech.qualityStandards)
        ? rawTech.qualityStandards.map(norm).filter(Boolean)
        : [],
      experienceRequirements: Array.isArray(rawTech.experienceRequirements)
        ? rawTech.experienceRequirements.map(norm).filter(Boolean)
        : []
    };

    // 6. Mandatory Documents
    const mandatoryDocuments = Array.isArray(data.mandatoryDocuments)
      ? data.mandatoryDocuments.map((doc) => {
          const docName = doc.documentName || doc.name || 'Document Requirement';
          const category = doc.category || 'General';
          const isMandatory = doc.mandatory !== undefined ? Boolean(doc.mandatory) : (doc.requirementStatus === 'Mandatory');
          const isConditional = doc.conditional !== undefined ? Boolean(doc.conditional) : (doc.requirementStatus === 'Conditional');
          const requirementType = doc.requirementType || (isMandatory ? 'must_submit' : (isConditional ? 'where_applicable' : 'may_submit'));

<<<<<<< HEAD
          let pageVal = null;
          if (Number.isInteger(doc.page)) pageVal = doc.page;

          const sectionVal = doc.section || null;
          let approxPos = doc.approximatePosition || null;
          if (!approxPos) {
            if (pageVal && sectionVal) approxPos = `Page ${pageVal} (${sectionVal})`;
            else if (pageVal) approxPos = `Page ${pageVal}`;
            else if (sectionVal) approxPos = sectionVal;
          }

          const conf = typeof doc.confidence === 'number' ? Math.min(1, Math.max(0, doc.confidence)) : 0.90;
          const rel = typeof doc.relevance === 'number' ? Math.min(1, Math.max(0, doc.relevance)) : conf;

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          return {
            documentName: docName,
            category,
            mandatory: isMandatory,
            conditional: isConditional,
            requirementType,
            sourceText: doc.sourceText || doc.source || null,
<<<<<<< HEAD
            section: sectionVal,
            page: pageVal,
            approximatePosition: approxPos,
            confidence: conf,
            relevance: rel
=======
            section: doc.section || null,
            page: Number.isInteger(doc.page) ? doc.page : null,
            confidence: typeof doc.confidence === 'number' ? Math.min(1, Math.max(0, doc.confidence)) : 0.90
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          };
        })
      : [];

    // 7. Commercial Terms
    const rawComm = data.commercialTerms || {};
    const commercialTerms = {
      contractDuration: norm(rawComm.contractDuration),
      renewalConditions: norm(rawComm.renewalConditions),
      paymentSchedule: norm(rawComm.paymentSchedule),
      warrantyRequirements: norm(rawComm.warrantyRequirements),
      maintenanceRequirements: norm(rawComm.maintenanceRequirements),
      deliverySchedule: norm(rawComm.deliverySchedule),
      liquidatedDamages: norm(rawComm.liquidatedDamages),
      penalties: norm(rawComm.penalties),
      terminationConditions: norm(rawComm.terminationConditions),
      blacklistingConditions: norm(rawComm.blacklistingConditions),
      disputeResolution: norm(rawComm.disputeResolution),
      arbitration: norm(rawComm.arbitration),
      forceMajeure: norm(rawComm.forceMajeure),
      otherObligations: Array.isArray(rawComm.otherObligations)
        ? rawComm.otherObligations.map(norm).filter(Boolean)
        : []
    };

    // 8. Ambiguous Clauses
    const ambiguousClauses = Array.isArray(data.ambiguousClauses)
<<<<<<< HEAD
      ? data.ambiguousClauses.map((ac) => {
          let pageVal = null;
          if (Number.isInteger(ac.page)) pageVal = ac.page;

          const sectionVal = ac.section || null;
          let approxPos = ac.approximatePosition || null;
          if (!approxPos) {
            if (pageVal && sectionVal) approxPos = `Page ${pageVal} (${sectionVal})`;
            else if (pageVal) approxPos = `Page ${pageVal}`;
            else if (sectionVal) approxPos = sectionVal;
          }

          const conf = typeof ac.confidence === 'number' ? ac.confidence : 0.60;
          const rel = typeof ac.relevance === 'number' ? ac.relevance : conf;

          return {
            clauseText: ac.clauseText || ac.text || 'Ambiguous text',
            section: sectionVal,
            page: pageVal,
            approximatePosition: approxPos,
            ambiguityReason: ac.ambiguityReason || 'Unclear scope or conditional phrasing',
            confidence: conf,
            relevance: rel
          };
        })
=======
      ? data.ambiguousClauses.map((ac) => ({
          clauseText: ac.clauseText || ac.text || 'Ambiguous text',
          section: ac.section || null,
          page: Number.isInteger(ac.page) ? ac.page : null,
          ambiguityReason: ac.ambiguityReason || 'Unclear scope or conditional phrasing',
          confidence: typeof ac.confidence === 'number' ? ac.confidence : 0.60
        }))
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      : [];

    // 9. Calculate Extraction Health Summary
    let totalFields = 0;
    let requirementsCount = 0;
    let lowConfidenceCount = 0;
    let ambiguousCount = ambiguousClauses.length;

    const inspectField = (f) => {
      if (!f) return;
      totalFields++;
      if (f.confidence !== undefined && f.confidence < 0.70) {
        lowConfidenceCount++;
      }
      if (f.isAmbiguous) {
        ambiguousCount++;
      }
    };

    [
      eligibility.annualTurnover, eligibility.netWorth, eligibility.yearsOfExperience, eligibility.similarWorkExperience,
      eligibility.oemRequirements, eligibility.msmeConditions, eligibility.consortiumConditions, eligibility.geographicEligibility,
      financialRequirements.emd, financialRequirements.tenderFee, financialRequirements.performanceSecurity,
      financialRequirements.securityDeposit, financialRequirements.bankGuarantee, financialRequirements.paymentTerms,
      technicalRequirements.scopeOfWork, technicalRequirements.minimumManpower, technicalRequirements.infrastructureRequirements,
      technicalRequirements.deliveryRequirements, commercialTerms.contractDuration, commercialTerms.liquidatedDamages,
      commercialTerms.penalties, commercialTerms.terminationConditions, commercialTerms.disputeResolution
    ].forEach(f => {
      if (f) {
        inspectField(f);
        requirementsCount++;
      }
    });

    eligibility.technicalQualifications.forEach(inspectField);
    eligibility.requiredCertifications.forEach(inspectField);
    eligibility.otherConditions.forEach(inspectField);
    financialRequirements.otherThresholds.forEach(inspectField);
    technicalRequirements.technicalSpecifications.forEach(inspectField);
    technicalRequirements.equipmentRequirements.forEach(inspectField);
    technicalRequirements.technologyRequirements.forEach(inspectField);
    technicalRequirements.serviceLevelRequirements.forEach(inspectField);
    technicalRequirements.qualityStandards.forEach(inspectField);
    technicalRequirements.experienceRequirements.forEach(inspectField);
    commercialTerms.otherObligations.forEach(inspectField);

    importantDates.forEach(d => {
      totalFields++;
      if (d.confidence < 0.70) lowConfidenceCount++;
    });

    mandatoryDocuments.forEach(doc => {
      totalFields++;
      requirementsCount++;
      if (doc.confidence < 0.70) lowConfidenceCount++;
    });

    const extractionHealth = {
      fieldsExtracted: totalFields,
      requirementsDetected: requirementsCount,
      deadlinesDetected: importantDates.length,
      documentsDetected: mandatoryDocuments.length,
      lowConfidenceItems: lowConfidenceCount,
      ambiguousClausesCount: ambiguousCount,
      overallQualityScore: totalFields > 0 ? Math.round(Math.max(30, 100 - (lowConfidenceCount * 10) - (ambiguousCount * 5))) : 0
    };

    return {
      basicInformation,
      importantDates,
      eligibility,
      financialRequirements,
      technicalRequirements,
      mandatoryDocuments,
      commercialTerms,
      ambiguousClauses,
      extractionHealth
    };
  }
}
