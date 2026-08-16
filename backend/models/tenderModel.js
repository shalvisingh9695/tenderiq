/**
 * Tender Model & Storage abstraction
 * Supports MongoDB if MONGO_URI is set, with automatic fallback to local store.
 */

import { TenderAnalysisService } from '../services/tenderAnalysisService.js';
import { RiskIntelligenceService } from '../services/riskIntelligenceService.js';

// In-memory + File persistent store fallback
const memoryStore = new Map();

// Initialize with a default demo tender if store is empty
if (memoryStore.size === 0) {
  const rawDemoAnalysis = {
    basicInformation: {
      title: 'City Smart Grid Modernization & Infrastructure Upgrade Project',
      referenceId: 'RFP-2026-SG-089',
      procuringAuthority: 'Department of Public Works & Energy',
      department: 'City Municipal Board',
      tenderType: 'Open Competitive RFP',
      procurementCategory: 'Smart Grid Infrastructure & IoT',
      location: 'Metropolitan District 4',
      estimatedValue: '$2,400,000',
      currency: 'USD',
      status: 'Open'
    },
    importantDates: [
      { type: 'publication', label: 'RFP Publication Date', dateString: '2026-08-01', originalText: 'August 1, 2026', sourceText: 'Section 2: RFP Publication Date: August 1, 2026', page: 1, section: 'Section 2: Important Schedule', confidence: 0.98 },
      { type: 'preBid', label: 'Pre-Bid Meeting', dateString: '2026-08-18', originalText: 'August 18, 2026 at 10:00 AM EST', sourceText: 'Section 2: Pre-Bid Meeting (Virtual): August 18, 2026 at 10:00 AM EST', page: 1, section: 'Section 2: Important Schedule', confidence: 0.95 },
      { type: 'clarificationDeadline', label: 'Clarification Deadline', dateString: '2026-08-25', originalText: 'August 25, 2026', sourceText: 'Section 2: Clarification Deadline: August 25, 2026', page: 1, section: 'Section 2: Important Schedule', confidence: 0.95 },
      { type: 'submissionDeadline', label: 'Bid Submission Deadline', dateString: '2026-09-30', originalText: 'September 30, 2026 by 17:00 EST', sourceText: 'Section 2: Bid Submission Deadline: September 30, 2026 by 17:00 EST', page: 1, section: 'Section 2: Important Schedule', confidence: 0.99 },
      { type: 'technicalOpening', label: 'Technical Bid Opening', dateString: '2026-10-02', originalText: 'October 2, 2026', sourceText: 'Section 2: Technical Bid Opening: October 2, 2026', page: 1, section: 'Section 2: Important Schedule', confidence: 0.96 },
      { type: 'financialOpening', label: 'Financial Bid Opening', dateString: '2026-10-10', originalText: 'October 10, 2026', sourceText: 'Section 2: Financial Bid Opening: October 10, 2026', page: 1, section: 'Section 2: Important Schedule', confidence: 0.96 }
    ],
    eligibility: {
      annualTurnover: { value: '$5,000,000 USD average over last 3 years (2023-2025)', sourceText: '3.1 Financial Turnover: Minimum average annual turnover of $5,000,000 USD over the last 3 financial years', section: 'Section 3: Eligibility & Qualification', page: 1, confidence: 0.97, requirementType: 'explicit', isAmbiguous: false },
      netWorth: { value: 'Positive net worth certified by independent auditor', sourceText: '3.2 Net Worth: Positive net worth certified by an independent auditor', section: 'Section 3: Eligibility & Qualification', page: 1, confidence: 0.94, requirementType: 'explicit', isAmbiguous: false },
      yearsOfExperience: { value: 'Minimum 5 years of experience in smart grid hardware deployment and SCADA integration', sourceText: '3.3 Experience: Minimum 5 years of experience in smart grid hardware deployment', section: 'Section 3: Eligibility & Qualification', page: 1, confidence: 0.98, requirementType: 'explicit', isAmbiguous: false },
      similarWorkExperience: { value: 'Completed at least 2 similar projects valued at >= $1,500,000 USD each', sourceText: '3.4 Similar Works: Completed at least 2 similar projects valued at >= $1,500,000 USD each', section: 'Section 3: Eligibility & Qualification', page: 1, confidence: 0.95, requirementType: 'explicit', isAmbiguous: false },
      technicalQualifications: [{ value: 'Smart grid hardware deployment and SCADA integration expertise', sourceText: '3.3 Experience', section: 'Section 3', page: 1, confidence: 0.95 }],
      requiredCertifications: [
        { value: 'ISO 9001 Quality Management Certificate', sourceText: '3.5 Required Certifications: ISO 9001 (Quality Management)', section: 'Section 3.5', page: 1, confidence: 0.98 },
        { value: 'ISO 27001 Information Security Certificate', sourceText: '3.5 Required Certifications: ISO 27001 (Information Security)', section: 'Section 3.5', page: 1, confidence: 0.98 }
      ],
      requiredRegistrations: ['Company Registration / Incorporation Certificate'],
      requiredLicenses: ['IoT Frequency Operating Permit'],
      oemRequirements: null,
      msmeConditions: { value: 'MSME registration exempts from tender fee upon valid certificate submission', sourceText: 'Section 5.7: MSME/NSIC Registration Certificate', section: 'Section 5', page: 2, confidence: 0.90, requirementType: 'optional' },
      consortiumConditions: { value: 'Joint ventures allowed up to 2 partners. Lead partner must hold >= 51% stake', sourceText: '3.6 Consortium/JV: Joint ventures allowed up to 2 partners. Lead partner must hold >= 51% stake', section: 'Section 3.6', page: 1, confidence: 0.96, requirementType: 'conditional' },
      geographicEligibility: { value: 'Open international bidding with local support presence requirement', sourceText: 'Section 1: Procurement Overview', section: 'Section 1', page: 1, confidence: 0.92 },
      otherConditions: [{ value: 'Non-blacklisting self-declaration affidavit notarized', sourceText: 'Section 5.6: Non-blacklisting affidavit', section: 'Section 5.6', page: 2, confidence: 0.96 }]
    },
    financialRequirements: {
      emd: { value: '$48,000 USD (2% of estimated value)', sourceText: '4.1 Earnest Money Deposit (EMD): $48,000 USD (2% of estimated value) via Bank Guarantee or Demand Draft', section: 'Section 4: Financial & Security', page: 2, confidence: 0.98, requirementType: 'explicit' },
      tenderFee: { value: '$500 USD (Non-refundable)', sourceText: '4.2 Tender Document Fee: $500 USD (Non-refundable)', section: 'Section 4: Financial & Security', page: 2, confidence: 0.98, requirementType: 'explicit' },
      performanceSecurity: { value: '10% of total contract value ($240,000 USD) upon signing', sourceText: '4.3 Performance Security: 10% of total contract value ($240,000 USD) upon contract signing', section: 'Section 4: Financial & Security', page: 2, confidence: 0.96, requirementType: 'explicit' },
      securityDeposit: { value: 'Included in Performance Security Bank Guarantee', sourceText: '4.3 Performance Security', section: 'Section 4.3', page: 2, confidence: 0.90 },
      bankGuarantee: { value: 'Bank Guarantee accepted for EMD and Performance Security', sourceText: '4.1 & 4.3 Bank Guarantee conditions', section: 'Section 4', page: 2, confidence: 0.95 },
      paymentTerms: { value: '30% on hardware delivery, 40% on testing & commissioning, 30% in quarterly installments over SLA period', sourceText: '4.4 Payment Schedule: 30% on hardware delivery, 40% on testing & commissioning, 30% in quarterly installments over SLA period', section: 'Section 4.4', page: 2, confidence: 0.95 },
      otherThresholds: [{ value: '$1,000 penalty per SLA response breach', sourceText: 'Section 6.3 SLA breach penalty', section: 'Section 6.3', page: 2, confidence: 0.94 }]
    },
    technicalRequirements: {
      scopeOfWork: { value: 'Implementation of automated smart metering, IoT edge nodes, and grid management platform across District 4', sourceText: '1.1 Objective: Implementation of automated smart metering, IoT edge nodes, and grid management platform across District 4', section: 'Section 1.1', page: 1, confidence: 0.98 },
      technicalSpecifications: [
        { value: 'IoT Edge Controllers with telemetry sensors', sourceText: 'Section 1.1 & 2', section: 'Section 1', page: 1, confidence: 0.95 },
        { value: 'Modbus/DNP3 SCADA protocol bridges', sourceText: 'Section 3.3', section: 'Section 3', page: 1, confidence: 0.95 },
        { value: 'AES-256 encrypted telemetry transmission', sourceText: 'Section 3.5 Security', section: 'Section 3', page: 1, confidence: 0.92 }
      ],
      minimumManpower: { value: 'Key personnel: 1 Chief Architect, 2 Systems Engineers, 2 Field Operations Leads', sourceText: 'Section 3.3 Experience & Manpower', section: 'Section 3.3', page: 1, confidence: 0.92 },
      equipmentRequirements: [{ value: 'Smart Meter Testing Rigs and Calibrated Optical Probes', sourceText: 'Section 1 & 3', section: 'Section 3', page: 1, confidence: 0.90 }],
      infrastructureRequirements: { value: 'Redundant cloud or local monitoring console with automated failover support', sourceText: 'Section 1.1 Grid management platform', section: 'Section 1', page: 1, confidence: 0.91 },
      technologyRequirements: [{ value: 'Modbus/DNP3 SCADA protocol integration', sourceText: 'Section 3.3', section: 'Section 3', page: 1, confidence: 0.95 }],
      serviceLevelRequirements: [{ value: '24/7 support with emergency response time < 15 minutes', sourceText: '6.3 Service Level Agreement (SLA): 24/7 support with emergency response time < 15 minutes', section: 'Section 6.3', page: 2, confidence: 0.97 }],
      deliveryRequirements: { value: 'Full commissioning within 180 days of contract award', sourceText: 'Section 6.1 & delivery timeline', section: 'Section 6', page: 2, confidence: 0.93 },
      qualityStandards: [{ value: 'ISO 9001 and IEC 61850 grid automation standards', sourceText: 'Section 3.5 & Quality', section: 'Section 3', page: 1, confidence: 0.96 }],
      experienceRequirements: [{ value: 'Minimum 5 years of experience in smart grid hardware deployment', sourceText: 'Section 3.3', section: 'Section 3', page: 1, confidence: 0.98 }]
    },
    mandatoryDocuments: [
      { documentName: 'Certificate of Incorporation & Company Registration', category: 'Legal', mandatory: true, conditional: false, requirementType: 'must_submit', sourceText: '1. Certificate of Incorporation & Company Registration (Legal / Mandatory)', section: 'Section 5: Mandatory Documents', page: 2, confidence: 0.99 },
      { documentName: 'Audited Financial Balance Sheets (2023-2025)', category: 'Financial', mandatory: true, conditional: false, requirementType: 'must_submit', sourceText: '2. Audited Financial Balance Sheets (Financial / Mandatory)', section: 'Section 5: Mandatory Documents', page: 2, confidence: 0.98 },
      { documentName: 'ISO 9001 & ISO 27001 Certificates', category: 'Certification', mandatory: true, conditional: false, requirementType: 'must_submit', sourceText: '3. ISO 9001 & ISO 27001 Certificates (Certifications / Mandatory)', section: 'Section 5: Mandatory Documents', page: 2, confidence: 0.97 },
      { documentName: 'Client Completion Certificates for Similar Works', category: 'Experience', mandatory: true, conditional: false, requirementType: 'must_submit', sourceText: '4. Client Satisfaction & Completion Certificates for Similar Works (Experience / Mandatory)', section: 'Section 5: Mandatory Documents', page: 2, confidence: 0.95 },
      { documentName: 'EMD Bank Guarantee Copy', category: 'Financial', mandatory: true, conditional: false, requirementType: 'must_submit', sourceText: '5. EMD Bank Guarantee Copy (Financial / Mandatory)', section: 'Section 5: Mandatory Documents', page: 2, confidence: 0.98 },
      { documentName: 'Non-Blacklisting Self-Declaration Affidavit', category: 'Declarations', mandatory: true, conditional: false, requirementType: 'must_submit', sourceText: '6. Non-Blacklisting Self-Declaration Affidavit (Legal / Mandatory)', section: 'Section 5: Mandatory Documents', page: 2, confidence: 0.96 },
      { documentName: 'MSME/NSIC Registration Certificate', category: 'Registration', mandatory: false, conditional: true, requirementType: 'where_applicable', sourceText: '7. MSME/NSIC Registration Certificate (Registration / Optional)', section: 'Section 5: Mandatory Documents', page: 2, confidence: 0.90 }
    ],
    commercialTerms: {
      contractDuration: { value: '36 Months (3 Years) from date of award', sourceText: '6.1 Contract Duration: 36 Months (3 Years) from date of award', section: 'Section 6.1', page: 2, confidence: 0.98 },
      renewalConditions: { value: 'Extendable by 12 months based on SLA performance review', sourceText: 'Section 6.1 Renewal terms', section: 'Section 6.1', page: 2, confidence: 0.90 },
      paymentSchedule: { value: '30% on delivery, 40% on testing, 30% in SLA installments', sourceText: 'Section 4.4 Payment Schedule', section: 'Section 4.4', page: 2, confidence: 0.95 },
      warrantyRequirements: { value: '24 Months comprehensive hardware & software warranty', sourceText: 'Section 6.3 Warranty terms', section: 'Section 6.3', page: 2, confidence: 0.92 },
      maintenanceRequirements: { value: 'Quarterly preventative maintenance and patch updates over SLA duration', sourceText: 'Section 1.2 & 6.3 SLA maintenance', section: 'Section 6', page: 2, confidence: 0.91 },
      deliverySchedule: { value: 'Hardware delivery in 60 days, commissioning in 180 days', sourceText: 'Section 6.1 & delivery schedule', section: 'Section 6', page: 2, confidence: 0.93 },
      liquidatedDamages: { value: '0.5% of contract value per week of unexcused delay, capped at maximum 10% total contract value', sourceText: '6.2 Liquidated Damages: 0.5% of contract value per week of unexcused delay, capped at maximum 10% total contract value', section: 'Section 6.2', page: 2, confidence: 0.98 },
      penalties: { value: '$1,000 penalty per response breach exceeding 15 minutes', sourceText: '6.3 Failure to meet SLA incurs $1,000 penalty per breach', section: 'Section 6.3', page: 2, confidence: 0.96 },
      terminationConditions: { value: '30 days written notice for default', sourceText: '6.4 Termination & Dispute Resolution: 30 days written notice for default', section: 'Section 6.4', page: 2, confidence: 0.95 },
      blacklistingConditions: { value: 'Non-performance or false qualification documents lead to debarment', sourceText: 'Section 6.4 Debarment conditions', section: 'Section 6.4', page: 2, confidence: 0.92 },
      disputeResolution: { value: 'Disputes subject to Arbitration under Municipal Commerce Rules', sourceText: 'Section 6.4 Arbitration under Municipal Commerce Rules', section: 'Section 6.4', page: 2, confidence: 0.95 },
      arbitration: { value: 'Municipal Commerce Rules Arbitration', sourceText: 'Section 6.4 Arbitration', section: 'Section 6.4', page: 2, confidence: 0.95 },
      forceMajeure: { value: 'Standard force majeure covering acts of God and government regulations', sourceText: 'Section 6.4 Standard Force Majeure', section: 'Section 6.4', page: 2, confidence: 0.90 },
      otherObligations: [{ value: 'Maintain cyber liability insurance of at least $1,000,000 USD', sourceText: 'Section 6.4 Insurance requirement', section: 'Section 6.4', page: 2, confidence: 0.91 }]
    }
  };

  const demoTender = {
    id: 'tnd_demo_9821',
    name: 'Municipal_Infrastructure_RFP_2026.pdf',
    originalName: 'Municipal_Infrastructure_RFP_2026.pdf',
    size: 1485760,
    sizeFormatted: '1.42 MB',
    mimeType: 'application/pdf',
    extension: '.pdf',
    uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'analyzed',
    previewSnippet: 'REQUEST FOR PROPOSAL (RFP) - City Smart Grid Modernization & Infrastructure Upgrade Project. Section 4.2: Liquidated damages clause 2.5% per week...',
    extractedText: `REQUEST FOR PROPOSAL (RFP)
City Smart Grid Modernization & Infrastructure Upgrade Project
Tender Reference ID: RFP-2026-SG-089
Issuing Body: Department of Public Works & Energy, City Municipal Board

SECTION 1: PROCUREMENT OVERVIEW
1.1 Objective: Implementation of automated smart metering, IoT edge nodes, and grid management platform across District 4.
1.2 Estimated Value: $2,400,000 USD (Inclusive of 3-year SLA and maintenance).
1.3 Location: Metropolitan District 4, City Center Substation.

SECTION 2: IMPORTANT SCHEDULE & DATES
- RFP Publication Date: August 1, 2026
- Document Download Start: August 3, 2026
- Pre-Bid Meeting (Virtual): August 18, 2026 at 10:00 AM EST
- Clarification Deadline: August 25, 2026
- Bid Submission Start: September 1, 2026
- Bid Submission Deadline: September 30, 2026 by 17:00 EST
- Technical Bid Opening: October 2, 2026
- Financial Bid Opening: October 10, 2026

SECTION 3: ELIGIBILITY & QUALIFICATION CRITERIA
3.1 Financial Turnover: Minimum average annual turnover of $5,000,000 USD over the last 3 financial years (2023-2025).
3.2 Net Worth: Positive net worth certified by an independent auditor.
3.3 Experience: Minimum 5 years of experience in smart grid hardware deployment and SCADA integration.
3.4 Similar Works: Completed at least 2 similar projects valued at >= $1,500,000 USD each.
3.5 Required Certifications: ISO 9001 (Quality Management) and ISO 27001 (Information Security).
3.6 Consortium/JV: Joint ventures allowed up to 2 partners. Lead partner must hold >= 51% stake.

SECTION 4: FINANCIAL & SECURITY REQUIREMENTS
4.1 Earnest Money Deposit (EMD): $48,000 USD (2% of estimated value) via Bank Guarantee or Demand Draft.
4.2 Tender Document Fee: $500 USD (Non-refundable).
4.3 Performance Security: 10% of total contract value ($240,000 USD) upon contract signing.
4.4 Payment Schedule: 30% on hardware delivery, 40% on testing & commissioning, 30% in quarterly installments over SLA period.

SECTION 5: MANDATORY DOCUMENTS TO SUBMIT
1. Certificate of Incorporation & Company Registration (Legal / Mandatory)
2. Audited Financial Balance Sheets (Financial / Mandatory)
3. ISO 9001 & ISO 27001 Certificates (Certifications / Mandatory)
4. Client Satisfaction & Completion Certificates for Similar Works (Experience / Mandatory)
5. EMD Bank Guarantee Copy (Financial / Mandatory)
6. Non-Blacklisting Self-Declaration Affidavit (Legal / Mandatory)
7. MSME/NSIC Registration Certificate (Registration / Optional)

SECTION 6: CONTRACTUAL TERMS & PENALTIES
6.1 Contract Duration: 36 Months (3 Years) from date of award.
6.2 Liquidated Damages: 0.5% of contract value per week of unexcused delay, capped at maximum 10% total contract value.
6.3 Service Level Agreement (SLA): 24/7 support with emergency response time < 15 minutes. Failure to meet SLA incurs $1,000 penalty per breach.
6.4 Termination & Dispute Resolution: 30 days written notice for default. Disputes subject to Arbitration under Municipal Commerce Rules.`,
    analysisStatus: 'analyzed',
    analyzedAt: new Date(Date.now() - 3600000).toISOString(),
    analysisError: null,
    structuredAnalysis: TenderAnalysisService.normalizeAnalysisResult(rawDemoAnalysis),
    riskStatus: 'completed',
    riskAnalyzedAt: new Date(Date.now() - 3000000).toISOString(),
    riskError: null,
    riskReport: RiskIntelligenceService.normalizeRiskReport({
      overallScore: 64,
      overallLevel: 'High',
      executiveSummary: 'The tender presents a High risk profile (Score: 64/100), primarily driven by high 10% Performance Security BG requirements ($240,000 USD), strict 15-minute SLA response penalties ($1,000/breach), and 10% max Liquidated Damages cap.',
      categoryScores: {
        financialRisk: { score: 72, level: 'High', summary: 'High upfront cash/credit commitment including 10% performance BG and 2% EMD.', majorFactors: ['10% Performance Security BG ($240k)', 'EMD Bank Guarantee ($48k)', 'Milestone payment delay risks'] },
        legalRisk: { score: 68, level: 'High', summary: 'Strict liquidated damages capped at 10% contract value and mandatory debarment clauses.', majorFactors: ['0.5%/week Liquidated Damages capped at 10%', 'Non-blacklisting affidavit requirement', 'Arbitration under Municipal Commerce Rules'] },
        operationalRisk: { score: 58, level: 'Moderate', summary: 'Aggressive 180-day commissioning deadline and stringent 24/7 emergency response SLA.', majorFactors: ['180-day full commissioning timeline', '24/7 support with <15 min response window', 'IoT SCADA protocol bridging'] },
        eligibilityRisk: { score: 45, level: 'Moderate', summary: 'High $5M average turnover requirement over 3 years, but JV/Consortium is permitted.', majorFactors: ['$5M USD 3-year turnover threshold', '2 similar works >= $1.5M each', 'JV allowed up to 2 partners'] },
        complianceRisk: { score: 32, level: 'Low', summary: 'Clear document checklist with ISO 9001 and ISO 27001 requirements.', majorFactors: ['Mandatory ISO 9001 & 27001 certificates', 'Notarized self-declaration affidavit'] }
      },
      riskFactors: [
        { title: 'High Performance Security Commitment (10% / $240,000)', category: 'financial', severity: 'high', scoreImpact: 20, explanation: 'Contractor must issue a bank guarantee for 10% of full contract value prior to receiving initial milestone payments.', sourceText: '4.3 Performance Security: 10% of total contract value ($240,000 USD) upon contract signing', section: 'Section 4: Financial & Security', page: 2, confidence: 0.98 },
        { title: 'Strict SLA Penalty ($1,000 per Emergency Response Breach)', category: 'operational', severity: 'high', scoreImpact: 15, explanation: 'Emergency response time is under 15 minutes 24/7. Repeated SLA breaches can accumulate heavy recurring financial penalties.', sourceText: '6.3 Service Level Agreement (SLA): 24/7 support with emergency response time < 15 minutes. Failure to meet SLA incurs $1,000 penalty per breach.', section: 'Section 6.3', page: 2, confidence: 0.96 },
        { title: 'Liquidated Damages Capped at 10% Contract Value', category: 'legal', severity: 'high', scoreImpact: 15, explanation: 'Unexcused delivery delay incurs 0.5% per week up to a maximum of 10% total contract value ($240,000).', sourceText: '6.2 Liquidated Damages: 0.5% of contract value per week of unexcused delay, capped at maximum 10% total contract value.', section: 'Section 6.2', page: 2, confidence: 0.97 },
        { title: 'High 3-Year Average Turnover Requirement ($5,000,000)', category: 'eligibility', severity: 'medium', scoreImpact: 10, explanation: 'Bidders must demonstrate $5M average turnover over 2023-2025, which limits participation of smaller smart grid vendors.', sourceText: '3.1 Financial Turnover: Minimum average annual turnover of $5,000,000 USD over the last 3 financial years', section: 'Section 3.1', page: 1, confidence: 0.97 },
        { title: '180-Day Aggressive Commissioning Schedule', category: 'operational', severity: 'medium', scoreImpact: 10, explanation: 'Deploying and testing SCADA bridges across District 4 within 6 months presents supply chain and field labor risks.', sourceText: 'Section 6.1: Full commissioning within 180 days of contract award', section: 'Section 6.1', page: 2, confidence: 0.93 }
      ],
      redFlags: [
        { title: 'Substantial Upfront Capital Commitment ($288,500 total collateral)', severity: 'high', explanation: 'EMD ($48k) + Performance Security ($240k) + Fee ($500) creates high upfront cash flow lockup.', sourceText: 'Section 4: Financial & Security Requirements', section: 'Section 4', page: 2, confidence: 0.97 },
        { title: '<15 Minute SLA Response Window', severity: 'high', explanation: 'Extremely short emergency response time requires dedicated 24/7 local field teams stationed in District 4.', sourceText: 'Section 6.3 SLA response time < 15 minutes', section: 'Section 6.3', page: 2, confidence: 0.95 }
      ],
      positiveSignals: [
        { title: 'Joint Ventures & Consortium Allowed', explanation: 'Subcontracting and JVs allowed up to 2 partners, helping smaller firms pool turnover.', sourceText: '3.6 Consortium/JV: Joint ventures allowed up to 2 partners. Lead partner must hold >= 51% stake', section: 'Section 3.6', page: 1, confidence: 0.96 },
        { title: 'MSME Tender Fee Exemption', explanation: 'Registered MSME vendors are exempt from paying the $500 non-refundable document fee.', sourceText: 'Section 5.7 MSME/NSIC Registration Certificate exemption', section: 'Section 5.7', page: 2, confidence: 0.90 },
        { title: 'Clear Payment Milestones', explanation: '30% upfront hardware payment and 40% testing payment mitigates long-term cash crunch.', sourceText: '4.4 Payment Schedule: 30% on hardware delivery, 40% on testing & commissioning', section: 'Section 4.4', page: 2, confidence: 0.95 }
      ],
      penaltyAnalysis: {
        liquidatedDamages: { penaltyType: 'Liquidated Damages', trigger: 'Unexcused project delivery delay', financialConsequence: '0.5% contract value per week (Max 10% / $240,000 USD)', sourceText: '6.2 Liquidated Damages: 0.5% of contract value per week of unexcused delay, capped at maximum 10%', section: 'Section 6.2', page: 2, confidence: 0.97 },
        delayPenalties: { penaltyType: 'Delay Penalty', trigger: 'Failure to meet intermediate milestone dates', financialConsequence: 'Part of Liquidated Damages weekly rate', sourceText: 'Section 6.2 & 6.1 delivery timeline', section: 'Section 6.2', page: 2, confidence: 0.92 },
        slaBreachPenalties: { penaltyType: 'SLA Breach Penalty', trigger: 'Emergency response time > 15 minutes', financialConsequence: '$1,000 USD penalty per incident breach', sourceText: '6.3 Service Level Agreement: Failure to meet SLA incurs $1,000 penalty per breach', section: 'Section 6.3', page: 2, confidence: 0.96 },
        terminationConsequences: { penaltyType: 'Termination Consequences', trigger: 'Material breach or 30 days default notice expiry', financialConsequence: 'Forfeiture of Performance BG ($240,000 USD) and potential debarment', sourceText: '6.4 Termination & Dispute Resolution: 30 days written notice for default', section: 'Section 6.4', page: 2, confidence: 0.91 },
        blacklistingRules: { penaltyType: 'Debarment & Blacklisting', trigger: 'Misrepresentation in qualification affidavit or willful abandonment', financialConsequence: '1-3 years ban from city procurement tenders', sourceText: 'Section 5.6: Non-blacklisting self-declaration affidavit', section: 'Section 5.6', page: 2, confidence: 0.95 },
        securityForfeiture: { penaltyType: 'Security Forfeiture', trigger: 'Withdrawal of bid during validity or failure to submit Performance Security', financialConsequence: 'Full EMD ($48,000 USD) forfeiture', sourceText: 'Section 4.1 EMD forfeiture conditions', section: 'Section 4.1', page: 2, confidence: 0.94 }
      },
      financialExposure: {
        totalEstimatedCommitment: '$288,500 USD upfront bank guarantees and fees',
        emd: { commitmentName: 'Earnest Money Deposit (EMD)', amount: '$48,000 USD', derivationType: 'Explicitly Stated', paymentDeadline: 'With Bid Submission', refundability: 'Refundable to unsuccessful bidders after award', sourceText: '4.1 EMD: $48,000 USD (2% of estimated value)', section: 'Section 4.1', page: 2, confidence: 0.98 },
        tenderFee: { commitmentName: 'Tender Document Fee', amount: '$500 USD', derivationType: 'Explicitly Stated', paymentDeadline: 'At document download / registration', refundability: 'Non-refundable (Exempt for MSMEs)', sourceText: '4.2 Tender Document Fee: $500 USD', section: 'Section 4.2', page: 2, confidence: 0.98 },
        performanceSecurity: { commitmentName: 'Performance Security BG', amount: '$240,000 USD', derivationType: 'Derived from stated tender values', paymentDeadline: 'Within 14 days of award notice', refundability: 'Released 60 days after contract completion', sourceText: '4.3 Performance Security: 10% of total contract value ($240,000 USD)', section: 'Section 4.3', page: 2, confidence: 0.96 },
        exposureSummary: 'Requires $48.5k cash/bg upon bid submission plus $240k Performance BG upon winning.'
      },
      topRisks: [
        'High Performance Security Commitment (10% / $240,000)',
        'Strict SLA Penalty ($1,000 per Emergency Response Breach)',
        'Liquidated Damages Capped at 10% Contract Value'
      ],
      topPositiveSignals: [
        'Joint Ventures & Consortium Allowed',
        'MSME Tender Fee Exemption',
        'Clear Payment Milestones'
      ],
      recommendedAreasToInvestigate: [
        'Verify if SLA response time measurement starts at automated ticket creation or human dispatch.',
        'Assess bank line of credit capacity for $240,000 USD Performance Bank Guarantee.',
        'Confirm local field partner agreement in Metropolitan District 4 for 15-minute response.'
      ]
    }),
    decisionStatus: 'completed',
    decisionEvaluatedAt: new Date(Date.now() - 2000000).toISOString(),
    decisionReport: {
      recommendation: 'Apply',
      confidence: 0.94,
      winProbability: 78,
      eligibilityMatchScore: 88,
      riskImpactScore: 64,
      financialFitScore: 85,
      complianceScore: 82,
      decisionSummary: 'Nexus Grid Tech Solutions Ltd is recommended to APPLY for the Smart Grid Modernization tender. With an annual turnover of $8.0M against a $5.0M threshold and 7 years of domain experience, the company meets all core eligibility criteria. High performance security collateral ($240k) and strict 15-minute SLA response penalties should be mitigated via a local field support partner in District 4.',
      strengths: [
        'Strong turnover capacity ($8,000,000 USD vs $5,000,000 USD requirement)',
        '7 years of proven domain experience in smart grid & SCADA hardware',
        'ISO 9001 and ISO 27001 certifications fully match mandatory tender requirements',
        'Documented experience in similar municipal grid deployments ($2M+ each)'
      ],
      weaknesses: [
        'High upfront collateral commitment ($288,500 total EMD and Performance Bank Guarantee)',
        'Aggressive 15-minute emergency response SLA requires dedicated local presence in District 4',
        '0.5% per week delay penalty capped at 10% total contract value'
      ],
      criticalGaps: [],
      evaluatedAt: new Date(Date.now() - 2000000).toISOString(),
      companyProfileSnapshot: {
        companyName: 'Nexus Grid Tech Solutions Ltd',
        annualTurnover: 8000000,
        yearsOfExperience: 7,
        similarProjectExperience: true,
        certifications: ['ISO 9001', 'ISO 27001'],
        registrations: ['Company Registration / Incorporation Certificate'],
        manpowerCapacity: 65,
        geographicPresence: 'Metropolitan District & State Level',
        MSMEorStartup: false
      }
    }
  };

  memoryStore.set(demoTender.id, demoTender);
}

export class TenderModel {
  static async save(tender) {
    memoryStore.set(tender.id, tender);
    return tender;
  }

  static async findAll() {
    return Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  static async findById(id) {
    return memoryStore.get(id) || null;
  }

  static async update(id, updateFields) {
    const existing = memoryStore.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updateFields };
    memoryStore.set(id, updated);
    return updated;
  }

  static async deleteById(id) {
    return memoryStore.delete(id);
  }
}
