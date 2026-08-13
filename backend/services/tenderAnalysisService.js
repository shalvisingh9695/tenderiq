import { GoogleGenAI, Type } from '@google/genai';

/**
 * Tender Analysis Service using Gemini API
 * Analyzes document text and converts it into source-traceable procurement intelligence.
 */
export class TenderAnalysisService {
  /**
   * Main function to analyze extracted tender text
   * @param {string} documentText - Raw text extracted from PDF/DOCX/TXT
   * @param {Object} metadata - File metadata (name, extension, etc.)
   * @returns {Promise<Object>} Normalized structured tender analysis
   */
  static async analyzeTenderText(documentText, metadata = {}) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY in Settings > Secrets.'
      );
    }

    if (!documentText || documentText.trim().length === 0) {
      throw new Error('No text content was found in the uploaded document to analyze.');
    }

    // Limit text length if extremely massive (>100k chars) to fit context comfortably
    const maxChars = 100000;
    const truncatedText = documentText.length > maxChars 
      ? documentText.substring(0, maxChars) + '\n\n[...Document truncated for AI analysis...]'
      : documentText;

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
   - DO NOT convert ₹5 Crore to ₹5 Lakh or 10% to 10.
4. SOURCE TRACEABILITY & PAGE NUMBERS:
   - For every extracted field, include:
     * "value": The extracted requirement value or text.
     * "sourceText": The exact sentence or clause snippet from the tender document.
     * "section": The section name or heading where the clause appears (e.g., "Section 3.1 Eligibility").
     * "page": Integer page number ONLY if explicitly indicated in text (e.g. "Page 14" or header/footer marker). Otherwise set to null. NEVER fabricate page numbers.
     * "confidence": Float between 0.0 and 1.0 representing extraction confidence (0.90+ High, 0.70-0.89 Medium, <0.70 Low).
5. DEADLINES:
   - Categorize dates into types: "publication", "preBid", "clarificationDeadline", "submissionStart", "submissionDeadline", "technicalOpening", "financialOpening", "other".
   - Store "originalText" (e.g., "30th Sept 2026 at 5:00 PM") and "normalizedDate" (YYYY-MM-DD if safely parseable, otherwise null).
6. MANDATORY DOCUMENTS:
   - Identify every required document, its category (Legal, Financial, Technical, Experience, Certification, Registration, Declarations, Other), whether it is mandatory vs conditional, and requirement status ("must_submit", "may_submit", "where_applicable").

Return ONLY a valid JSON object matching the requested schema without markdown formatting or commentary.`;

    const userPrompt = `Document Title/Filename: ${metadata.name || 'Tender Document'}

TENDER DOCUMENT TEXT:
"""
${truncatedText}
"""

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
        throw new Error('Received an empty response from Gemini AI model.');
      }

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
    }
  }

  /**
   * Normalizes any object/string into a consistent SourceTraceable object
   */
  static normalizeSourceItem(item) {
    if (!item) return null;
    if (typeof item === 'string') {
      return {
        value: item,
        sourceText: null,
        section: null,
        page: null,
        confidence: 0.90,
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

    const reqType = item.requirementType || (item.mandatory === false ? 'conditional' : 'explicit');
    const isAmbiguous = Boolean(item.isAmbiguous || reqType === 'ambiguous');

    return {
      value: String(value),
      sourceText: item.sourceText || item.source || item.snippet || null,
      section: item.section || item.sectionHeading || null,
      page: pageVal,
      confidence: conf,
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

          return {
            type: d.type || 'other',
            label: d.label || 'Key Date',
            originalText: d.originalText || d.originalWording || d.dateString || 'Unspecified',
            normalizedDate,
            sourceText: d.sourceText || d.source || null,
            section: d.section || null,
            page: pageVal,
            confidence: typeof d.confidence === 'number' ? Math.min(1.0, Math.max(0, d.confidence)) : 0.90
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

          return {
            documentName: docName,
            category,
            mandatory: isMandatory,
            conditional: isConditional,
            requirementType,
            sourceText: doc.sourceText || doc.source || null,
            section: doc.section || null,
            page: Number.isInteger(doc.page) ? doc.page : null,
            confidence: typeof doc.confidence === 'number' ? Math.min(1, Math.max(0, doc.confidence)) : 0.90
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
      ? data.ambiguousClauses.map((ac) => ({
          clauseText: ac.clauseText || ac.text || 'Ambiguous text',
          section: ac.section || null,
          page: Number.isInteger(ac.page) ? ac.page : null,
          ambiguityReason: ac.ambiguityReason || 'Unclear scope or conditional phrasing',
          confidence: typeof ac.confidence === 'number' ? ac.confidence : 0.60
        }))
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
