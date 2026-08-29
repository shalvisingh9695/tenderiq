/**
 * Heuristic & Rule-Based Tender Extraction Fallback Engine
 * 
 * Used when Gemini AI service reaches rate limits (HTTP 429) or is temporarily busy.
 * Extracts key fields using NLP regex patterns, section chunking, and procurement vocabularies
 * so the user experience never blocks or breaks.
 */

export class HeuristicExtractor {
  static extractFromText(text, metadata = {}) {
    if (!text || typeof text !== 'string') {
      text = '';
    }

    const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const lowerText = text.toLowerCase();

    // 1. Basic Information
    let title = metadata.name ? metadata.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Tender Document';
    const titleMatch = text.match(/(?:NOTICE\s+INVITING\s+TENDER|REQUEST\s+FOR\s+PROPOSAL|TENDER\s+NOTICE|TENDER\s+DOCUMENT\s+FOR|NAME\s+OF\s+WORK|SUBJECT)\s*[:\-–]?\s*([^\n\r]{10,140})/i) ||
                       text.match(/(?:TENDER\s+FOR|BID\s+DOCUMENT\s+FOR)\s+([^\n\r]{10,140})/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim().replace(/^[:\-–\s]+/, '');
    } else if (lines.length > 0 && lines[0].length > 5 && lines[0].length < 120) {
      title = lines[0];
    }

    // Reference ID
    let referenceId = null;
    const refMatch = text.match(/(?:Tender\s*(?:Ref|Reference|No|Notice\s*No|ID)|NIT\s*(?:No|Reference)|Bid\s*(?:Ref|Identification\s*No)|RFP\s*No|GEM\s*Ref)\s*[:\-–]?\s*([A-Za-z0-9\/\-_\.]{4,40})/i);
    if (refMatch && refMatch[1]) {
      referenceId = refMatch[1].trim();
    }

    // Procuring Authority
    let procuringAuthority = null;
    const authMatch = text.match(/(?:Procuring\s+Authority|Client|Organization|Employer|Purchaser|Department|Authority|Issuer)\s*[:\-–]?\s*([^\n\r]{5,80})/i) ||
                      text.match(/(?:Government\s+of\s+[^\n\r,]+|State\s+Electricity\s+Board|[A-Z][A-Za-z\s]+(?:Corporation|Authority|Ltd|Limited|Board|Ministry|Department|Agency))/);
    if (authMatch) {
      procuringAuthority = (authMatch[1] || authMatch[0]).trim();
    }

    // Estimated Value
    let estimatedValue = null;
    let currency = 'INR';
    const estValMatch = text.match(/(?:Estimated\s*(?:Cost|Value|Tender\s*Value)|Approximate\s*Cost|Contract\s*Value)\s*[:\-–]?\s*([₹RsINR$\€\£\d\s,\.\-CroresLakhsMillionBillion]+)/i);
    if (estValMatch && estValMatch[1]) {
      estimatedValue = estValMatch[1].trim().replace(/[:\-–\s]+$/, '');
      if (estimatedValue.includes('$')) currency = 'USD';
      else if (estimatedValue.includes('€')) currency = 'EUR';
    }

    // 2. Financial Requirements (EMD, Tender Fee, Performance Security)
    let emd = null;
    const emdMatch = text.match(/(?:EMD|Earnest\s+Money(?:\s+Deposit)?|Bid\s+Security)\s*[:\-–]?\s*([₹RsINR$\€\£\d\s,\.\-CroresLakhsMillionBillion%]+(?:INR|USD|Rs|₹|\/-)?)/i);
    if (emdMatch && emdMatch[1]) {
      const emdVal = emdMatch[1].trim();
      emd = {
        value: emdVal,
        sourceText: emdMatch[0],
        section: 'Financial Terms',
        page: 1,
        approximatePosition: 'Middle of document',
        confidence: 0.95,
        relevance: 0.95,
        requirementType: 'explicit',
        isAmbiguous: false
      };
    }

    let tenderFee = null;
    const feeMatch = text.match(/(?:Tender\s*(?:Document)?\s*Fee|Cost\s*of\s*Tender(?:\s*Document)?|Document\s*Fee)\s*[:\-–]?\s*([₹RsINR$\€\£\d\s,\.\-CroresLakhsMillionBillion]+(?:INR|USD|Rs|₹|\/-)?)/i);
    if (feeMatch && feeMatch[1]) {
      tenderFee = {
        value: feeMatch[1].trim(),
        sourceText: feeMatch[0],
        section: 'Financial Terms',
        page: 1,
        approximatePosition: 'Middle of document',
        confidence: 0.95,
        relevance: 0.95,
        requirementType: 'explicit',
        isAmbiguous: false
      };
    }

    let performanceSecurity = null;
    const pbMatch = text.match(/(?:Performance\s*(?:Security|Bank\s*Guarantee|Guarantee|Deposit)|PBG|Security\s*Deposit)\s*[:\-–]?\s*([^\n\r.]{5,60})/i);
    if (pbMatch && pbMatch[1]) {
      performanceSecurity = {
        value: pbMatch[1].trim(),
        sourceText: pbMatch[0],
        section: 'Commercial & Security Terms',
        page: 1,
        approximatePosition: 'Commercial Terms',
        confidence: 0.90,
        relevance: 0.90,
        requirementType: 'explicit',
        isAmbiguous: false
      };
    }

    // 3. Eligibility (Turnover, Experience)
    let annualTurnover = null;
    const toMatch = text.match(/(?:(?:Annual|Average)\s*(?:Financial)?\s*Turnover|Turnover\s*Requirement|Minimum\s*Turnover)\s*[:\-–]?\s*([^\n\r,;]{4,60})/i);
    if (toMatch && toMatch[1]) {
      annualTurnover = {
        value: toMatch[1].trim(),
        sourceText: toMatch[0],
        section: 'Eligibility Criteria',
        page: 1,
        approximatePosition: 'Eligibility Section',
        confidence: 0.95,
        relevance: 0.95,
        requirementType: 'explicit',
        isAmbiguous: false
      };
    }

    let yearsOfExperience = null;
    const expMatch = text.match(/(\d+\s*(?:\+)?\s*(?:years?|yrs?)(?:\s+of)?\s*(?:experience|track\s*record|past\s*experience|in\s*the\s*field))/i) ||
                    text.match(/(?:Experience\s*Requirement|Past\s*Experience)\s*[:\-–]?\s*([^\n\r.]{4,60})/i);
    if (expMatch) {
      yearsOfExperience = {
        value: (expMatch[1] || expMatch[0]).trim(),
        sourceText: expMatch[0],
        section: 'Eligibility Criteria',
        page: 1,
        approximatePosition: 'Eligibility Section',
        confidence: 0.92,
        relevance: 0.92,
        requirementType: 'explicit',
        isAmbiguous: false
      };
    }

    // 4. Important Dates
    const importantDates = [];
    const subMatch = text.match(/(?:Last\s*Date\s*(?:and\s*Time)?\s*of\s*Submission|Submission\s*Deadline|Bid\s*Submission\s*Closing|Due\s*Date)\s*[:\-–]?\s*([^\n\r,;]{6,60})/i);
    if (subMatch && subMatch[1]) {
      importantDates.push({
        type: 'submissionDeadline',
        label: 'Bid Submission Deadline',
        originalText: subMatch[1].trim(),
        normalizedDate: subMatch[1].trim(),
        sourceText: subMatch[0],
        section: 'Tender Schedule',
        page: 1,
        approximatePosition: 'Schedule of Events',
        confidence: 0.98,
        relevance: 0.98
      });
    }

    const openMatch = text.match(/(?:Technical\s*Bid\s*Opening|Bid\s*Opening\s*Date|Opening\s*of\s*(?:Technical\s*)?Bids)\s*[:\-–]?\s*([^\n\r,;]{6,60})/i);
    if (openMatch && openMatch[1]) {
      importantDates.push({
        type: 'technicalBidOpening',
        label: 'Technical Bid Opening',
        originalText: openMatch[1].trim(),
        normalizedDate: openMatch[1].trim(),
        sourceText: openMatch[0],
        section: 'Tender Schedule',
        page: 1,
        approximatePosition: 'Schedule of Events',
        confidence: 0.95,
        relevance: 0.95
      });
    }

    // 5. Mandatory Documents Detection
    const mandatoryDocuments = [];
    const docKeywords = [
      { name: 'GST Registration Certificate', cat: 'statutory', pattern: /\b(?:gst|gstin|goods and services tax)\b/i },
      { name: 'PAN Card Copy', cat: 'statutory', pattern: /\b(?:pan|permanent account number)\b/i },
      { name: 'EMD / Bid Security Instrument', cat: 'financial', pattern: /\b(?:emd|earnest money|bid security)\b/i },
      { name: 'Audited Financial Statements / Balance Sheets (Last 3 Years)', cat: 'financial', pattern: /\b(?:audited|balance sheet|ca certificate|turnover certificate)\b/i },
      { name: 'Experience / Past Work Completion Certificates', cat: 'technical', pattern: /\b(?:completion certificate|experience certificate|work order|past performance)\b/i },
      { name: 'ISO 9001 / Quality Certification', cat: 'compliance', pattern: /\b(?:iso\s*9001|quality certification|bis|isi)\b/i },
      { name: 'Power of Attorney / Authorization Letter', cat: 'legal', pattern: /\b(?:power of attorney|poa|board resolution|authorization letter)\b/i },
      { name: 'Non-Blacklisting Undertaking / Affidavit', cat: 'compliance', pattern: /\b(?:blacklisting|non-blacklisted|debarment|affidavit)\b/i }
    ];

    docKeywords.forEach((doc, idx) => {
      if (doc.pattern.test(text)) {
        mandatoryDocuments.push({
          documentName: doc.name,
          category: doc.cat,
          mandatory: true,
          format: 'PDF / Scanned Copy',
          submissionStage: 'Technical Bid Cover',
          sourceText: `Required under tender specifications`,
          section: 'Checklist of Mandatory Documents',
          page: 1,
          approximatePosition: 'Annexures / Checklists',
          confidence: 0.90,
          relevance: 0.90
        });
      }
    });

    if (mandatoryDocuments.length === 0) {
      mandatoryDocuments.push({
        documentName: 'Technical & Commercial Bid Submission Sheet',
        category: 'technical',
        mandatory: true,
        format: 'PDF',
        submissionStage: 'Cover 1',
        sourceText: 'Standard procurement submission',
        section: 'General Instructions',
        page: 1,
        approximatePosition: 'General',
        confidence: 0.85,
        relevance: 0.85
      });
    }

    // 6. Scope & Commercial Terms
    let scopeOfWork = 'Procurement, execution, and supply under the stated tender guidelines.';
    const scopeMatch = text.match(/(?:Scope\s*of\s*Work|Brief\s*Scope|Nature\s*of\s*Work)\s*[:\-–]?\s*([^\n\r]{10,200})/i);
    if (scopeMatch && scopeMatch[1]) {
      scopeOfWork = scopeMatch[1].trim();
    }

    let liquidatedDamages = null;
    const ldMatch = text.match(/(?:Liquidated\s*Damages|Penalty\s*for\s*Delay|Delay\s*Penalty)\s*[:\-–]?\s*([^\n\r.]{5,100})/i);
    if (ldMatch && ldMatch[1]) {
      liquidatedDamages = {
        value: ldMatch[1].trim(),
        sourceText: ldMatch[0],
        section: 'General Conditions of Contract',
        page: 1,
        approximatePosition: 'Penalties & LD Clause',
        confidence: 0.90,
        relevance: 0.90
      };
    }

    return {
      basicInformation: {
        title,
        referenceId,
        procuringAuthority,
        department: null,
        tenderType: 'Open / E-Tender',
        procurementCategory: 'Works & Services',
        location: null,
        estimatedValue,
        currency,
        status: 'Active'
      },
      importantDates,
      eligibility: {
        annualTurnover,
        netWorth: null,
        yearsOfExperience,
        similarWorkExperience: null,
        technicalQualifications: [],
        requiredCertifications: [],
        requiredRegistrations: [],
        requiredLicenses: [],
        oemRequirements: null,
        msmeConditions: null,
        consortiumConditions: null,
        geographicEligibility: null,
        otherConditions: []
      },
      financialRequirements: {
        emd,
        tenderFee,
        performanceSecurity,
        securityDeposit: null,
        bankGuarantee: null,
        paymentTerms: null,
        otherThresholds: []
      },
      technicalRequirements: {
        scopeOfWork,
        technicalSpecifications: [],
        minimumManpower: null,
        equipmentRequirements: [],
        infrastructureRequirements: null,
        technologyRequirements: [],
        serviceLevelRequirements: [],
        deliveryRequirements: null,
        qualityStandards: [],
        experienceRequirements: []
      },
      mandatoryDocuments,
      commercialTerms: {
        contractDuration: null,
        renewalConditions: null,
        paymentSchedule: null,
        warrantyRequirements: null,
        maintenanceRequirements: null,
        deliverySchedule: null,
        liquidatedDamages,
        penalties: null,
        terminationConditions: null,
        blacklistingConditions: null,
        disputeResolution: null,
        arbitration: null,
        forceMajeure: null,
        otherObligations: []
      },
      ambiguousClauses: [],
      metadata: {
        extractionMode: 'rule-based-fallback',
        isHeuristicFallback: true,
        extractedAt: new Date().toISOString()
      }
    };
  }
}
