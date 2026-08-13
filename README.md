# 🚀 TenderIQ — AI-Powered Tender Intelligence & Bid Decision System

TenderIQ is a full-stack AI-powered platform that helps companies analyze tender documents and make data-driven bidding decisions.

It combines **RAG (Retrieval-Augmented Generation)**, **Risk Intelligence**, and a **Decision Engine** to answer one critical question:

👉 *Should you apply for this tender?*

---

## ✨ Key Features

### 📄 1. Tender Intelligence Extraction
- Upload PDF, DOCX, or TXT tender documents
- Extract:
  - Eligibility criteria
  - Financial requirements
  - Technical specifications
  - Important deadlines
- Clause-level **source attribution + confidence scoring**

---

### ⚠️ 2. Advanced Risk Intelligence Engine
- Detects:
  - Financial Risk
  - Legal/Contractual Risk
  - Operational Risk
  - Eligibility Risk
  - Compliance Risk
- Provides:
  - Risk Score (0–100)
  - Red Flags
  - Positive Signals
  - Penalty Analysis
  - Financial Exposure

---

### 🧠 3. Bid Decision Engine
- Takes company profile input
- Compares with tender requirements
- Generates:
  - ✅ Apply / ⚠️ Consider / ❌ Avoid
  - 🎯 Win Probability (%)
  - 📊 Score Breakdown:
    - Eligibility Match
    - Risk Impact
    - Financial Fit
    - Compliance Difficulty

---

### 🤖 4. AI Explanation Layer
- Uses Gemini AI to generate:
  - Decision Summary
  - Strengths
  - Weaknesses
  - Critical Gaps
- Fully **explainable AI (not a black box)**

---

### 🎨 5. Premium Dashboard UI
- Built with React + Tailwind CSS
- Light **orange + grey SaaS theme**
- Glassmorphism cards
- Clean, modern, responsive layout

---

## 🧱 Tech Stack

### Frontend
- React (JSX)
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js

### AI / Intelligence
- Gemini API (@google/genai)
- Retrieval-Augmented Generation (RAG)

### File Processing
- pdf-parse (PDF)
- mammoth (DOCX)

---

## 🧠 System Architecture
Upload Document
↓
Text Extraction (PDF/DOCX/TXT)
↓
RAG Processing + Chunking
↓
Tender Intelligence Extraction (AI)
↓
Risk Intelligence Engine
↓
Decision Engine (Hybrid Logic + AI)
↓
Dashboard (UI Visualization)


---

## 📦 Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/tenderiq.git
cd tenderiq
2. Install dependencies
npm install
3. Setup environment variables

Create a .env file:

GEMINI_API_KEY=your_api_key_here
PORT=3000
4. Run the app
npm run dev

App will run on:
👉 http://localhost:3000

🔄 How It Works
Upload a tender document
System extracts structured procurement data
Risk engine analyzes potential risks
Enter your company profile
Decision engine recommends:
Apply / Consider / Avoid
AI explains WHY
🧪 Example Use Case

A company wants to bid on a government tender.

TenderIQ:

extracts requirements
detects high EMD + strict penalties
compares with company turnover
calculates win probability
recommends: “Consider” with risks explained
🚀 Future Improvements
Multi-tender comparison
Company profile saving
Proposal generator
Real-time collaboration
Cloud deployment (AWS / Vercel)
👩‍💻 Author

Shalvi Singh

⭐ If you like this project

Give it a star ⭐ on GitHub!