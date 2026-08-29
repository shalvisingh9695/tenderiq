/**
 * Default Benchmark & Sample Tenders with comprehensive procurement document text.
 * Used for RAG Q&A, Risk Analysis, and Bid Decision benchmarks.
 */

export const SAMPLE_TENDERS_BACKEND = [
  {
    id: 'tender-nhai-402',
    name: 'Design & Construction of 6-Lane Access Controlled Expressway (Pkg-4)',
    originalName: 'NHAI_EPC_Pkg4_TenderDoc.pdf',
    nitNumber: 'NHAI/Tech/2026/EPC-04/892',
    title: 'Design & Construction of 6-Lane Access Controlled Expressway (Pkg-4)',
    authority: 'National Highways Authority of India (NHAI)',
    shortAuthority: 'NHAI',
    sector: 'Infrastructure & EPC',
    sectorCode: 'infra',
    value: 4200000000,
    valueFormatted: '₹420.0 Cr',
    emd: 84000000,
    emdFormatted: '₹8.4 Cr',
    turnoverReq: '₹125.0 Cr (Avg last 3 FYs)',
    deadline: '2026-09-18T17:00:00Z',
    daysRemaining: 21,
    riskScore: 32,
    riskLevel: 'medium',
    riskLabel: 'Moderate Risk',
    eligibilityScore: 92,
    recommendation: 'GO',
    documentType: 'PDF',
    pages: 348,
    pagesCount: 348,
    fileSize: '18.4 MB',
    sizeFormatted: '18.4 MB',
    summary: 'EPC contract for 48.6 km greenfield expressway section including 4 major bridges, 12 underpasses, and intelligent traffic management system (ITMS).',
    previewSnippet: 'NATIONAL HIGHWAYS AUTHORITY OF INDIA (NHAI). Notice Inviting Tender for EPC Construction of 6-Lane Access Controlled Expressway Section (Km 142+000 to Km 190+600). Contract Value: INR 420.00 Crores. EMD: INR 8.40 Crores.',
    extractedText: `NATIONAL HIGHWAYS AUTHORITY OF INDIA (NHAI)
(Ministry of Road Transport and Highways, Government of India)
NOTICE INVITING TENDER (NIT) & BIDDING DOCUMENT
Tender Reference No: NHAI/Tech/2026/EPC-04/892
Project: Construction of 6-Lane Access Controlled Greenfield Highway (Package-4) from Km 142.000 to Km 190.600 on EPC Mode under Bharatmala Pariyojana.

SECTION I: INVITATION FOR BIDS (IFB)
1.1 The National Highways Authority of India (NHAI) invites open national competitive proposals on EPC (Engineering, Procurement, and Construction) turnkey basis.
1.2 Total Estimated Contract Value: INR 4,200,000,000 (Indian Rupees Four Hundred Twenty Crores only) exclusive of GST.
1.3 Completion Period: 730 days (24 Months) from Appointed Date.
1.4 Maintenance & Defect Liability Period: 5 (Five) Years from the date of Provisional Certificate.
1.5 Earnest Money Deposit (EMD / Bid Security): INR 84,000,000 (INR 8.40 Crores) in the form of Bank Guarantee from any Scheduled Commercial Bank in India, valid for 180 days from bid submission deadline.

SECTION II: INSTRUCTIONS TO BIDDERS & ELIGIBILITY CRITERIA
2.1 Technical Qualification: The bidder must have successfully executed, as a prime contractor or JV partner, at least one similar Highway/Expressway project of value not less than INR 210 Crores (50% of Contract Value) within the last 5 financial years (FY 2020-21 to FY 2024-25).
2.2 Financial Turnover: The bidder must demonstrate an Average Annual Financial Turnover of not less than INR 125.00 Crores over the last 3 audited financial years (FY 2022-23, 2023-24, and 2024-25). The turnover certificate must be issued by a Chartered Accountant with valid UDIN.
2.3 Net Worth: The bidder shall have a positive Net Worth of at least INR 42.00 Crores as on 31st March 2025.
2.4 Joint Venture (JV) Consortium: Maximum of 3 (three) partners allowed. Lead partner must hold a minimum 51% equity stake and meet at least 50% of technical and financial eligibility. Other JV partners must hold at least 20% equity stake each.

SECTION III: CONDITIONS OF CONTRACT & COMMERCIAL CLAUSES
Clause 18.2 - Liquidated Damages for Delay:
If the Contractor fails to achieve the project milestones within the prescribed time schedule or fail to complete the Works by the Scheduled Completion Date, Liquidated Damages shall be levied at the rate of 0.05% of the total Contract Price per day of unapproved delay, subject to an aggregate ceiling limit of 10% (ten percent) of the Contract Price. If the delay exceeds 120 days or the maximum cap is reached, the Authority reserves the right to terminate the contract and encash the Performance Security.

Clause 7.4 - Mobilization Advance:
The Authority shall provide an interest-bearing Mobilization Advance up to 10% (ten percent) of the Contract Price against an unconditional and irrevocable Bank Guarantee for 110% of the advance amount. The interest rate applicable shall be SBI MCLR + 1.5% per annum. Recovery shall commence when 10% of the contract value is certified.

Clause 12.1 - Price Escalation & Variation:
Price adjustment for variation in cost of diesel, labor, bitumen, and other materials shall be determined as per the standard RBI wholesale price index (WPI) formulas. However, no price escalation shall be applicable for cement and steel price variations below 10% from base index.

Clause 9.3 - Performance Security & Retention:
Within 28 days of Letter of Acceptance (LOA), the successful bidder shall submit Performance Security equal to 5% of Contract Value. In addition, Retention Money at 5% shall be deducted from each interim payment certificate, released upon issuance of the Final Completion Certificate.

Clause 26.5 - Dispute Resolution:
All disputes arising under this agreement shall be initially referred to the Dispute Avoidance/Adjudication Board (DAAB). If unsettled within 60 days, disputes shall be settled through arbitration under the Arbitration and Conciliation Act, 1996 in New Delhi.`
  },
  {
    id: 'tender-mop-smartgrid',
    name: 'Advanced Metering Infrastructure (AMI) & 1.2M Smart Meter Rollout',
    originalName: 'MoP_SmartGrid_AMI_RFP.pdf',
    nitNumber: 'MOP/AMI/2026/SG-109',
    title: 'Advanced Metering Infrastructure (AMI) & 1.2M Smart Meter Rollout',
    authority: 'Ministry of Power & State Distribution Utilities',
    shortAuthority: 'MoP / DISCOM',
    sector: 'Energy & Utilities',
    sectorCode: 'energy',
    value: 1658000000,
    valueFormatted: '₹165.8 Cr',
    emd: 33160000,
    emdFormatted: '₹3.31 Cr',
    turnoverReq: '₹55.0 Cr (Avg last 3 FYs)',
    deadline: '2026-09-29T15:30:00Z',
    daysRemaining: 32,
    riskScore: 24,
    riskLevel: 'low',
    riskLabel: 'Low Risk',
    eligibilityScore: 96,
    recommendation: 'GO',
    documentType: 'PDF',
    pages: 216,
    pagesCount: 216,
    fileSize: '12.1 MB',
    sizeFormatted: '12.1 MB',
    summary: 'Turnkey deployment of Head-End System (HES), Meter Data Management (MDM), cellular IoT SIMs, and 1.2 million smart electricity meters on DBFOOT model.',
    previewSnippet: 'MINISTRY OF POWER. RFP for Implementation of Advanced Metering Infrastructure (AMI) for 1.2 Million Consumers on DBFOOT Basis. Contract Value: INR 165.80 Crores. EMD: INR 3.31 Crores.',
    extractedText: `MINISTRY OF POWER & STATE ELECTRICITY DISTRIBUTION UTILITIES
REQUEST FOR PROPOSAL (RFP) - ADVANCED METERING INFRASTRUCTURE (AMI)
NIT Number: MOP/AMI/2026/SG-109

1. SCOPE OF WORK:
Implementation of 1.2 Million Single Phase & Three Phase Smart Electricity Meters with Head-End System (HES), Meter Data Management System (MDMS), Cellular 4G/NB-IoT Communication, and 10-Year O&M lifecycle support under DBFOOT (Design, Build, Finance, Own, Operate, Transfer) model.

2. FINANCIAL & QUALIFYING TERMS:
2.1 Estimated Project Value: INR 165.80 Crores.
2.2 EMD / Bid Security: INR 3.31 Crores (Bank Guarantee valid for 180 days).
2.3 Average Annual Turnover: INR 55.00 Crores in the last 3 financial years.
2.4 Positive Net Worth: INR 18.00 Crores as of March 31, 2025.

3. SLA & LIQUIDATED DAMAGES:
3.1 Service Level Agreement (SLA): Mandatory 99.5% uptime for daily meter data streaming.
3.2 Delay Penalty: 0.5% per week of delay up to a maximum of 10% of Capex value.
3.3 SLA Non-performance Penalty: Capped at 15% of monthly recurring service fees.
3.4 Data Sovereignty: All consumer meter data must be hosted on MeitY-empanelled Tier-III / Tier-IV Cloud data centers located strictly within the territory of India.`
  },
  {
    id: 'tender-mod-c4isr',
    name: 'Coastal Radar Surveillance & Multi-Sensor C4ISR Command Network',
    originalName: 'MOD_C4ISR_Radar_Network_Tender.pdf',
    nitNumber: 'MOD/DEF/2026/NAV-881',
    title: 'Coastal Radar Surveillance & Multi-Sensor C4ISR Command Network',
    authority: 'Ministry of Defence / Indian Coast Guard',
    shortAuthority: 'MoD / Coast Guard',
    sector: 'Defense & Aerospace',
    sectorCode: 'defense',
    value: 895000000,
    valueFormatted: '₹89.5 Cr',
    emd: 17900000,
    emdFormatted: '₹1.79 Cr',
    turnoverReq: '₹35.0 Cr (Avg last 3 FYs)',
    deadline: '2026-09-08T12:00:00Z',
    daysRemaining: 11,
    riskScore: 58,
    riskLevel: 'high',
    riskLabel: 'High Risk',
    eligibilityScore: 78,
    recommendation: 'REVIEW',
    documentType: 'PDF',
    pages: 184,
    pagesCount: 184,
    fileSize: '9.8 MB',
    sizeFormatted: '9.8 MB',
    summary: 'Supply, installation, and integration of high-definition X-band coastal radars, electro-optic tracking sensors, and encrypted tactical data links across 14 coastal nodes.',
    previewSnippet: 'MINISTRY OF DEFENCE / INDIAN COAST GUARD. Tender for Procurement of High-Definition Coastal Radars and Multi-Sensor C4ISR Surveillance System. Value: INR 89.50 Cr.',
    extractedText: `MINISTRY OF DEFENCE / INDIAN COAST GUARD
RFP NO: MOD/DEF/2026/NAV-881
PROJECT: PROCUREMENT & INTEGRATION OF 14 X-BAND COASTAL RADAR SURVEILLANCE SYSTEMS & C4ISR DATA LINK

1. ELIGIBILITY & MAKE IN INDIA:
1.1 Total Value: INR 89.50 Crores.
1.2 Mandatory Indigenous Content: Minimum 60% Class-I Local Supplier compliance under DPP / Make in India.
1.3 EMD: INR 1.79 Crores.
1.4 Average Annual Turnover: INR 35.00 Crores over last 3 audited FYs.

2. CRITICAL CLAUSES & PENALTIES:
2.1 No Deviation Policy: Any technical deviation or conditional bid will lead to immediate disqualification.
2.2 Penalty for Delay in Delivery: 1% of the contract value per week of delay or part thereof, up to a maximum of 15% of the total contract price.
2.3 Warranty & AMC: 36 Months comprehensive on-site warranty followed by mandatory 5 Years Annual Maintenance Contract (AMC).`
  },
  {
    id: 'tender-railtel-fiber',
    name: 'High-Speed DWDM Optical Fiber Backbone & Railway Station WiFi Tier-2',
    originalName: 'RailTel_DWDM_OFC_Tender.docx',
    nitNumber: 'RCIL/OFC/2026/DWDM-44',
    title: 'High-Speed DWDM Optical Fiber Backbone & Railway Station WiFi Tier-2',
    authority: 'RailTel Corporation of India Ltd',
    shortAuthority: 'RailTel',
    sector: 'Telecom & IT',
    sectorCode: 'telecom',
    value: 542000000,
    valueFormatted: '₹54.2 Cr',
    emd: 10840000,
    emdFormatted: '₹1.08 Cr',
    turnoverReq: '₹20.0 Cr (Avg last 3 FYs)',
    deadline: '2026-09-14T14:00:00Z',
    daysRemaining: 17,
    riskScore: 18,
    riskLevel: 'low',
    riskLabel: 'Low Risk',
    eligibilityScore: 98,
    recommendation: 'GO',
    documentType: 'DOCX',
    pages: 142,
    pagesCount: 142,
    fileSize: '6.5 MB',
    sizeFormatted: '6.5 MB',
    summary: 'Upgrade of 2,400 km backbone optical fiber with 100G DWDM transmission equipment and carrier-grade enterprise switches across 120 railway divisions.',
    previewSnippet: 'RAILTEL CORPORATION OF INDIA. Tender for Supply, Installation and Commissioning of DWDM Optical Network Equipment. Value: INR 54.20 Cr.',
    extractedText: `RAILTEL CORPORATION OF INDIA LIMITED
NIT: RCIL/OFC/2026/DWDM-44
TENDER FOR 100G DWDM TRANSMISSION EQUIPMENT & OPTICAL FIBER NETWORK EXPANSION

1. CONTRACT SPECIFICATIONS:
Value: INR 54.20 Crores. EMD: INR 1.08 Crores.
Delivery Period: 180 Days from issuance of Notice to Proceed (NTP).
Turnover Requirement: INR 20.00 Crores average in last 3 FYs.

2. PAYMENT & DELAY TERMS:
Payment: 70% upon proof of equipment dispatch and inspection certificate, 20% upon installation and testing, 10% upon final commissioning.
Liquidated Damages: 0.5% per week up to a maximum of 10% of contract value.`
  },
  {
    id: 'tender-nha-healthcloud',
    name: 'Unified Health Interface (UHI) Cloud Infrastructure & ABDM EHR Suite',
    originalName: 'NHA_ABDM_HealthCloud_RFP.pdf',
    nitNumber: 'NHA/ABDM/2026/CLOUD-12',
    title: 'Unified Health Interface (UHI) Cloud Infrastructure & ABDM EHR Suite',
    authority: 'National Health Authority (NHA)',
    shortAuthority: 'NHA',
    sector: 'Healthcare & GovTech',
    sectorCode: 'govtech',
    value: 386000000,
    valueFormatted: '₹38.6 Cr',
    emd: 7720000,
    emdFormatted: '₹77.2 Lakh',
    turnoverReq: '₹15.0 Cr (Avg last 3 FYs)',
    deadline: '2026-09-24T18:00:00Z',
    daysRemaining: 27,
    riskScore: 28,
    riskLevel: 'low',
    riskLabel: 'Low Risk',
    eligibilityScore: 94,
    recommendation: 'GO',
    documentType: 'PDF',
    pages: 160,
    pagesCount: 160,
    fileSize: '8.2 MB',
    sizeFormatted: '8.2 MB',
    summary: 'Cloud-native electronic health records microservices, FHIR-compliant interoperability gateways, and patient consent manager for the Ayushman Bharat Digital Mission.',
    previewSnippet: 'NATIONAL HEALTH AUTHORITY. RFP for Cloud Hosting, Interoperability Gateways and EHR Suite for Ayushman Bharat Digital Mission. Value: INR 38.60 Cr.',
    extractedText: `NATIONAL HEALTH AUTHORITY (NHA)
GOVERNMENT OF INDIA
RFP FOR UNIFIED HEALTH INTERFACE (UHI) & ABDM EHR SUITE (NHA/ABDM/2026/CLOUD-12)

Contract Value: INR 38.60 Crores. EMD: INR 77.20 Lakhs.
Turnover Requirement: Average INR 15.00 Crores over last 3 audited FYs.
SLA Uptime: 99.95% Availability with RPO < 5 mins and RTO < 15 mins.
Penalties: INR 50,000 per hour for Sev-1 downtime incidents.`
  },
  {
    id: 'tender-water-desal',
    name: '100 MLD Seawater Reverse Osmosis (SWRO) Desalination Plant & Outfall',
    originalName: 'WaterBoard_Desalination_EPC.pdf',
    nitNumber: 'TWAD/DESAL/2026/EPC-08',
    title: '100 MLD Seawater Reverse Osmosis (SWRO) Desalination Plant & Outfall',
    authority: 'State Water Supply & Drainage Board',
    shortAuthority: 'Water Board',
    sector: 'Infrastructure & EPC',
    sectorCode: 'infra',
    value: 2100000000,
    valueFormatted: '₹210.0 Cr',
    emd: 42000000,
    emdFormatted: '₹4.20 Cr',
    turnoverReq: '₹70.0 Cr (Avg last 3 FYs)',
    deadline: '2026-10-05T16:00:00Z',
    daysRemaining: 38,
    riskScore: 64,
    riskLevel: 'high',
    riskLabel: 'High Risk',
    eligibilityScore: 74,
    recommendation: 'REVIEW',
    documentType: 'PDF',
    pages: 290,
    pagesCount: 290,
    fileSize: '15.7 MB',
    sizeFormatted: '15.7 MB',
    summary: 'Turnkey engineering, marine intake/outfall pipeline, energy recovery system, and 7-year operation and maintenance of 100 million liters/day desalination facility.',
    previewSnippet: 'STATE WATER SUPPLY AND DRAINAGE BOARD. EPC Tender for 100 MLD SWRO Desalination Facility and 7 Years O&M. Value: INR 210.00 Cr.',
    extractedText: `STATE WATER SUPPLY & DRAINAGE BOARD
EPC TENDER FOR 100 MLD SEAWATER REVERSE OSMOSIS (SWRO) DESALINATION PLANT
NIT Ref: TWAD/DESAL/2026/EPC-08

Value: INR 210.00 Crores. EMD: INR 4.20 Crores.
Execution Period: 30 Months + 7 Years O&M.
Turnover Requirement: Average INR 70.00 Crores over last 3 audited FYs.
Environmental & CRZ compliance strictly under contractor responsibility. Liquidated damages: 0.05% per day up to 10%.`
  }
];
