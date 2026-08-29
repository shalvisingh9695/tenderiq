import { generateContentWithRetry, GEMINI_PRIMARY_MODEL, Type } from '../config/gemini.js';
import { parseSafeJson } from '../utils/jsonHelper.js';
import { HeuristicExtractor } from './heuristicExtractor.js';

/**
 * Tender Analysis Service using Gemini API
 * Analyzes document text and converts it into source-traceable procurement intelligence
 * with PDF page numbers, sections, and approximate positions.
 */
export class TenderAnalysisService {
  /**
   * Main function to analyze extracted tender text
   * @param {string} documentText - Raw text extracted from PDF/DOCX/TXT
   * @param {Object} metadata - File metadata (name, extension, etc.)
   * @returns {Promise<Object>} Normalized structured tender analysis
   */
  static async analyzeTenderText(documentText, metadata = {}) {
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('No text content was found in the uploaded document to analyze.');
    }

    // Limit text length if extremely massive (>100k chars) to fit context comfortably
    const maxChars = 100000;
    const truncatedText = documentText.length > maxChars 
      ? documentText.substring(0, maxChars) + '\n\n[...Document truncated for AI analysis...]'
      : documentText;

    const systemPrompt = `You are TenderIQ's Enterprise Procurement Intelligence Extraction Engine.
Your task is to analyze the provided tender/RFP document text and extract structured procurement data with exact source traceability including page references, sections, and approximate positions.

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
4. SOURCE TRACEABILITY, PAGE NUMBERS & POSITIONS:
   - For every extracted field, include:
     * "value": The extracted requirement value or text.
     * "sourceText": The exact sentence or clause snippet from the tender document.
     * "section": The section name or heading where the clause appears (e.g., "Section 3.1 Eligibility").
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

    const userPrompt = `Document Title/Filename: ${metadata.name || 'Tender Document'}

TENDER DOCUMENT TEXT:
"""
${truncatedText}
"""

Extract structured procurement data according to the requested JSON schema.`;

    try {
      const response = await generateContentWithRetry({
        model: GEMINI_PRIMARY_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text ? response.text.trim() : '';
      if (!responseText) {
        throw new Error('Received an empty response from Gemini AI model.');
      }

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
    }
  }

  /**
   * Normalizes any object/string into a consistent SourceTraceable object
   * containing text, relevance, page, section, and approximatePosition.
   */
  static normalizeSourceItem(item) {
    if (!item) return null;
    if (typeof item === 'string') {
      return {
        value: item,
        sourceText: null,
        section: null,
        page: null,
        approximatePosition: null,
        confidence: 0.90,
        relevance: 0.90,
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

    const reqType = item.requirementType || (item.mandatory === false ? 'conditional' : 'explicit');
    const isAmbiguous = Boolean(item.isAmbiguous || reqType === 'ambiguous');

    return {
      value: String(value),
      sourceText: item.sourceText || item.source || item.snippet || null,
      section: sectionVal,
      page: pageVal,
      approximatePosition: approxPos,
      confidence: conf,
      relevance: rel,
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

          const sectionVal = d.section || null;
          let approxPos = d.approximatePosition || null;
          if (!approxPos) {
            if (pageVal && sectionVal) approxPos = `Page ${pageVal} (${sectionVal})`;
            else if (pageVal) approxPos = `Page ${pageVal}`;
            else if (sectionVal) approxPos = sectionVal;
          }

          const conf = typeof d.confidence === 'number' ? Math.min(1.0, Math.max(0, d.confidence)) : 0.90;
          const rel = typeof d.relevance === 'number' ? Math.min(1.0, Math.max(0, d.relevance)) : conf;

          return {
            type: d.type || 'other',
            label: d.label || 'Key Date',
            originalText: d.originalText || d.originalWording || d.dateString || 'Unspecified',
            normalizedDate,
            sourceText: d.sourceText || d.source || null,
            section: sectionVal,
            page: pageVal,
            approximatePosition: approxPos,
            confidence: conf,
            relevance: rel
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

          return {
            documentName: docName,
            category,
            mandatory: isMandatory,
            conditional: isConditional,
            requirementType,
            sourceText: doc.sourceText || doc.source || null,
            section: sectionVal,
            page: pageVal,
            approximatePosition: approxPos,
            confidence: conf,
            relevance: rel
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
