# TenderIQ

**AI Tender & Procurement Intelligence Platform**

TenderIQ is an enterprise-grade AI-powered tender analysis platform that automates the extraction, risk scoring, bid/no-bid decision analysis, and interactive document querying of complex Request for Proposal (RFP) and tender documents.

---

## Overview

Public and private procurement processes often require analyzing hundreds of pages of complex, high-risk tender documentation under strict deadlines. Manual review is slow, error-prone, and exposes bidding organizations to hidden financial liabilities, aggressive service-level agreements (SLAs), and disqualification risks.

TenderIQ streamlines this lifecycle by converting raw procurement documents into structured, actionable intelligence with 100% source clause traceability and citation verification.

---

## Key Features

- **Multi-Format Ingestion**: Supports PDF, DOCX, and TXT files up to 25MB with automated client- and server-side validation.
- **Deterministic Structured Extraction**: Extracts core tender metadata, milestone timelines, eligibility criteria, financial commitments (EMD, PBG, tender fees), and technical specifications.
- **7-Dimension Risk Intelligence**: Evaluates and categorizes risks across Eligibility, Financial, Technical, Documentation, Timeline, Contractual, and Commercial dimensions.
- **Bid / No-Bid Decision Engine**: Calculates win probabilities, eligibility scores, financial fit, and generates executive-level Go/Review/No-Go recommendations with tailored gap analysis against user company profiles.
- **Information Gaps & Ambiguity Detection**: Highlights missing clauses, ambiguous specifications, and potential addendum requirements.
- **Grounded RAG Chat Assistant**: Chat with tender documents using retrieved semantic chunks, explicit page references, and section citations with confidence indicators.
- **Interactive PDF Traceability**: Direct page jumping and highlighted excerpt overlays inside an integrated modal PDF viewer.

---

## Architecture

TenderIQ is built on a full-stack Node.js + Express backend serving a React + Tailwind CSS client via Vite:

```
┌─────────────────────────────────────────────────────────────┐
│                    TenderIQ Web Client                      │
│     (React 19 + Tailwind CSS + Lucide Icons + React-PDF)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON APIs & File Streams
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express API Gateway                      │
│   (File Uploads, Route Handlers, Error Normalization)       │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Text Extract │       │ RAG Engine   │       │ Tender Store │
│ (pdf-parse / │       │ (TF-IDF /    │       │ (In-Memory / │
│   mammoth)   │       │ Chunker)     │       │ Persistence) │
└──────┬───────┘       └──────┬───────┘       └──────────────┘
       │                       │
       └───────────┬───────────┘
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         Centralized Gemini Client & Retry Engine            │
│   - Model: gemini-3.5-flash                                 │
│   - Exponential Backoff & Jitter Handler                    │
│   - Safe Error & Secret Sanitizer                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (Server-Side Only)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Google Gemini AI Platform                   │
└─────────────────────────────────────────────────────────────┘
```

---

## AI & RAG Pipeline

1. **Document Ingestion & Text Normalization**: Multi-page PDFs and Word documents are parsed into indexed text segments preserving page boundaries, headings, and character positions.
2. **Deterministic Information Extraction**: Prompts `gemini-3.5-flash` using structured JSON schemas to populate comprehensive procurement models.
3. **Retrieval-Augmented Generation (RAG)**: The document text is divided into contextual chunks with sliding windows. When a user asks questions in the Chat Assistant, a BM25/TF-IDF similarity engine retrieves the top relevant chunks to ground Gemini's answer strictly in document facts.
4. **Source Attribution**: Every extracted clause and answer citation includes page numbers, section headers, confidence ratings, and exact text excerpts.

---

## Risk Intelligence Engine

The Risk Intelligence module evaluates tenders against seven critical dimensions:

1. **Eligibility Risks**: Turnover thresholds, mandatory domain experience, and consortium restrictions.
2. **Financial Risks**: Earnest Money Deposit (EMD), Performance Bank Guarantees (PBG), and cash flow exposure.
3. **Technical Risks**: Complex technical requirements, OEM authorizations, and testing milestones.
4. **Documentation Risks**: Notarized affidavits, validity certificates, and apostille requirements.
5. **Timeline Risks**: Delivery schedules, liquidated damages triggers, and tight turnaround windows.
6. **Contractual Risks**: Indemnification clauses, liability caps, and dispute resolution mechanisms.
7. **Commercial Risks**: Price escalation locks, currency volatility, and penalty SLAs.

---

## Decision Engine

The Decision Engine combines deterministic mathematical qualification calculations with AI executive briefings:

- **Input**: User company profile (annual turnover, experience years, certifications, manpower, MSME status) compared against tender requirements.
- **Deterministic Scoring**: Authoritative calculations for Eligibility Match Score, Financial Fit Score, Compliance Score, and Win Probability.
- **AI Synthesis**: Generates executive briefings, key strengths, operational weaknesses, and critical missing criteria without overwriting deterministic calculations.
- **Output**: Clear **GO**, **REVIEW**, or **NO-GO** bid recommendations.

---

## PDF Traceability

- Extracted clauses contain exact page numbers and section metadata.
- Clicking **"View in PDF"** opens the built-in PDF viewer directly to the cited page.
- Text matches are highlighted with high-contrast visual cues for instant auditing.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Motion, Lucide React, React-PDF
- **Backend**: Node.js (ES Modules), Express 4, Multer
- **Parsers**: `pdf-parse`, `mammoth` (DOCX)
- **AI SDK**: `@google/genai` (Node.js SDK)
- **Primary Model**: `gemini-3.5-flash`

---

## Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tenderiq
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your valid `GEMINI_API_KEY` to `.env.local`.

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key used server-side for extraction, risk analysis, and RAG chat. |
| `PORT` | No | Server port (defaults to `3000`). |
| `APP_URL` | No | Base application URL for production deployment. |

> **Security Note**: `GEMINI_API_KEY` is strictly accessed on the backend server. It is never bundled into client-side code or exposed via browser network requests.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/upload` | Upload and ingest tender document (PDF, DOCX, TXT) |
| `GET` | `/api/tenders` | List all ingested tenders |
| `GET` | `/api/tenders/:id` | Get tender details and structured analysis |
| `GET` | `/api/tenders/:id/file` | Stream original document for inline PDF viewing |
| `POST` | `/api/tenders/:id/analyze` | Trigger Gemini structured procurement extraction |
| `POST` | `/api/tenders/:id/risk-analysis` | Generate 7-dimension risk intelligence report |
| `POST` | `/api/tenders/:id/decision` | Evaluate Bid Go/No-Go decision against company profile |
| `POST` | `/api/tenders/:id/chat` | Grounded RAG query against tender document |
| `DELETE` | `/api/tenders/:id` | Remove tender and associated disk files |

---

## Project Structure

```
tenderiq/
├── backend/
│   ├── config/
│   │   └── gemini.js            # Centralized Gemini client & retry handler
│   ├── controllers/
│   │   └── tenderController.js  # Request handlers and response formatting
│   ├── models/
│   │   └── tenderModel.js       # Tender storage abstraction
│   ├── routes/
│   │   └── tenderRoutes.js      # REST API route definitions
│   └── services/
│       ├── chatService.js             # Grounded RAG chat implementation
│       ├── decisionEngineService.js   # Bid Go/No-Go evaluation engine
│       ├── riskIntelligenceService.js  # 7-dimension risk evaluation
│       └── tenderAnalysisService.js   # Deterministic structured extraction
├── src/
│   ├── assets/                  # Brand assets and illustrations
│   ├── components/
│   │   ├── chat/                # RAG Chat assistant UI
│   │   ├── decision/            # Bid decision & company profile UI
│   │   ├── intelligence/        # Summary cards & information gaps UI
│   │   ├── pdf/                 # Modal PDF viewer with page jump & highlights
│   │   ├── risk/                # Risk breakdown & penalty analysis UI
│   │   ├── DashboardPage.jsx    # Main intelligence dashboard
│   │   ├── Footer.jsx           # Global footer
│   │   ├── HomePage.jsx         # Landing page & feature overview
│   │   ├── Navbar.jsx           # Sticky glassmorphism header & navigation
│   │   └── UploadPage.jsx       # Multi-file drag-and-drop upload screen
│   ├── App.jsx                  # Main client application router
│   ├── index.css                # Tailwind CSS v4 styling & glassmorphism theme
│   └── main.jsx                 # Client entry point
├── .env.example                 # Safe environment variable template
├── .gitignore                   # Ignore rules for secrets, dependencies, and builds
├── index.html                   # HTML entry point
├── metadata.json                # Project metadata
├── package.json                 # Project dependencies and npm scripts
├── server.js                    # Express + Vite integration server
└── vite.config.js               # Vite bundler configuration
```

---

## Security

- **Server-Side API Key Isolation**: All AI interactions occur through backend routes; no API keys are delivered to the frontend.
- **Error Sanitization**: Server-side error handlers strip API tokens, authorization headers, and query parameter keys from error messages before sending responses.
- **File Validation**: Multi-layer MIME type and file extension validation prevents unauthorized file formats. Uploaded files are assigned cryptographically random IDs to prevent path traversal.
- **Safe Environment Defaults**: Real credentials are excluded from source control and `.env.example`.

---

## Future Improvements

- Multi-tender comparative benchmarking across historical bids.
- Automated compliance matrix generation exportable to Excel and Word.
- Team-based multi-user workspace access with role-based permissions.
- Direct integration with public e-procurement portals (GeM, SAM.gov, TED).

---

© 2026 TenderIQ. All rights reserved.
