import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Info, 
  Layers, 
  ShieldAlert, 
  Database, 
  TrendingUp, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu
} from 'lucide-react';

import { AnalysisStatusHeader } from './intelligence/AnalysisStatusHeader';
import { ExtractionHealthCard } from './intelligence/ExtractionHealthCard';
import { SourceViewModal } from './intelligence/SourceViewModal';
import { TenderOverviewCard } from './intelligence/TenderOverviewCard';
import { DeadlineTimeline } from './intelligence/DeadlineTimeline';
import { EligibilityCard } from './intelligence/EligibilityCard';
import { FinancialReqsCard } from './intelligence/FinancialReqsCard';
import { TechnicalReqsCard } from './intelligence/TechnicalReqsCard';
import { MandatoryDocsChecklist } from './intelligence/MandatoryDocsChecklist';
import { ContractTermsCard } from './intelligence/ContractTermsCard';
import { RiskDashboardSection } from './risk/RiskDashboardSection';
import { DecisionSection } from './decision/DecisionSection';

export const DashboardPage = ({ 
  documents = [], 
  onNavigate, 
  onDeleteDocument,
  onUpdateDocument 
}) => {
  const [selectedDocId, setSelectedDocId] = useState(
    documents.length > 0 ? documents[0].id : ''
  );
  const [activeViewTab, setActiveViewTab] = useState('extraction'); // 'extraction' | 'risk'

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const [isRiskAnalyzing, setIsRiskAnalyzing] = useState(false);
  const [riskAnalysisError, setRiskAnalysisError] = useState(null);

  // Source View Modal State
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [modalSourceData, setModalSourceData] = useState(null);

  const activeDoc = documents.find((doc) => doc.id === selectedDocId) || documents[0];

  const handleOpenSourceModal = (sourceData) => {
    if (!sourceData) return;
    setModalSourceData(sourceData);
    setIsSourceModalOpen(true);
  };

  if (documents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Layers className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            No Tenders Uploaded Yet
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
            Upload your RFP or procurement document to run AI Tender Intelligence Extraction with Gemini.
          </p>
        </div>
        <button
          onClick={() => onNavigate('upload')}
          className="btn-primary-orange px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <Upload className="w-4 h-4" />
          Upload Tender Document
        </button>
      </div>
    );
  }

  // Trigger AI Tender Intelligence Analysis Endpoint
  const handleRunAnalysis = async () => {
    if (!activeDoc || !activeDoc.id) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    // Update doc status locally to analyzing
    if (onUpdateDocument) {
      onUpdateDocument({
        ...activeDoc,
        analysisStatus: 'analyzing',
        analysisError: null
      });
    }

    try {
      const response = await fetch(`/api/tenders/${activeDoc.id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Tender analysis failed. Please check Gemini API configuration.');
      }

      if (data.data && onUpdateDocument) {
        onUpdateDocument(data.data);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisError(err.message || 'An error occurred during AI analysis.');

      if (onUpdateDocument) {
        onUpdateDocument({
          ...activeDoc,
          analysisStatus: 'failed',
          analysisError: err.message || 'AI extraction failed.'
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger AI Risk Intelligence Endpoint
  const handleRunRiskAnalysis = async () => {
    if (!activeDoc || !activeDoc.id) return;

    setIsRiskAnalyzing(true);
    setRiskAnalysisError(null);

    if (onUpdateDocument) {
      onUpdateDocument({
        ...activeDoc,
        riskStatus: 'analyzing',
        riskError: null
      });
    }

    try {
      const response = await fetch(`/api/tenders/${activeDoc.id}/risk-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Risk Intelligence evaluation failed.');
      }

      if (data.data && onUpdateDocument) {
        onUpdateDocument(data.data);
      }
    } catch (err) {
      console.error('Risk analysis error:', err);
      setRiskAnalysisError(err.message || 'An error occurred during Risk Intelligence evaluation.');

      if (onUpdateDocument) {
        onUpdateDocument({
          ...activeDoc,
          riskStatus: 'failed',
          riskError: err.message || 'Risk Intelligence evaluation failed.'
        });
      }
    } finally {
      setIsRiskAnalyzing(false);
    }
  };

  const currentAnalysisStatus = isAnalyzing
    ? 'analyzing'
    : activeDoc?.analysisStatus || (activeDoc?.structuredAnalysis ? 'completed' : 'none');

  const currentAnalysisError = activeDoc?.analysisError || analysisError;
  const analysisData = activeDoc?.structuredAnalysis;

  const currentRiskStatus = isRiskAnalyzing
    ? 'analyzing'
    : activeDoc?.riskStatus || (activeDoc?.riskReport ? 'completed' : 'not_started');
  const currentRiskError = activeDoc?.riskError || riskAnalysisError;
  const riskReport = activeDoc?.riskReport;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Procurement Intelligence Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wider">
              TenderIQ AI Engine
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Clause-level extraction, eligibility rules, key dates, deposits, and penalty conditions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="btn-primary-orange px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto shadow-xs"
        >
          <Upload className="w-4 h-4" />
          Upload New Document
        </button>
      </div>

      {/* Document Selection Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-500" />
            Active Tender Documents ({documents.length})
          </label>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {documents.map((doc) => {
            const isSelected = doc.id === activeDoc?.id;
            const hasAnalysis = doc.analysisStatus === 'completed' || doc.structuredAnalysis;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-orange-50/90 border-orange-300 text-orange-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <FileText className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-slate-400'}`} />
                <span className="max-w-[180px] truncate">{doc.originalName}</span>
                
                {hasAnalysis && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Analyzed" />
                )}

                <span className="text-[10px] opacity-60">({doc.sizeFormatted})</span>
                
                {documents.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    className="p-1 hover:text-red-600 rounded-md transition-colors text-slate-400 ml-1"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-Navigation Tabs: Extraction vs. Risk Intelligence */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveViewTab('extraction')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeViewTab === 'extraction'
              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-xs'
              : 'bg-white/60 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Procurement Intelligence</span>
          {analysisData && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white font-mono">
              Ready
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveViewTab('risk')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeViewTab === 'risk'
              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-xs'
              : 'bg-white/60 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Advanced Risk Intelligence</span>
          {riskReport ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              activeViewTab === 'risk'
                ? 'bg-white text-orange-950'
                : 'bg-orange-100 text-orange-900'
            }`}>
              Score: {riskReport.overallScore}/100
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 uppercase">
              AI Engine
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveViewTab('decision')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeViewTab === 'decision'
              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-xs'
              : 'bg-white/60 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Decision</span>
          {activeDoc?.decisionReport ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              activeDoc.decisionReport.recommendation === 'Apply'
                ? 'bg-emerald-100 text-emerald-800'
                : activeDoc.decisionReport.recommendation === 'Avoid'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {activeDoc.decisionReport.recommendation}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-900 uppercase">
              Form Ready
            </span>
          )}
        </button>
      </div>

      {/* VIEW RENDER: EXTRACTION, RISK, OR DECISION ENGINE */}
      {activeViewTab === 'decision' ? (
        <DecisionSection
          activeDoc={activeDoc}
          onUpdateTenderData={(updates) => {
            if (onUpdateDocument) {
              onUpdateDocument({
                ...activeDoc,
                ...updates
              });
            }
          }}
        />
      ) : activeViewTab === 'risk' ? (
        <RiskDashboardSection
          riskReport={riskReport}
          riskStatus={currentRiskStatus}
          riskError={currentRiskError}
          onRunRiskAnalysis={handleRunRiskAnalysis}
          isAnalyzing={isRiskAnalyzing}
          onOpenSource={handleOpenSourceModal}
          hasTenderAnalysis={Boolean(analysisData)}
        />
      ) : (
        <>
          {/* AI Extraction Trigger / Status Header */}
          <AnalysisStatusHeader
            analysisStatus={currentAnalysisStatus}
            analyzedAt={activeDoc?.analyzedAt}
            analysisError={currentAnalysisError}
            onStartAnalysis={handleRunAnalysis}
          />

          {/* DETAILED STRUCTURED TENDER INTELLIGENCE SECTIONS */}
          {analysisData ? (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Extraction Quality & Health Summary */}
              {analysisData.extractionHealth && (
                <ExtractionHealthCard extractionHealth={analysisData.extractionHealth} />
              )}

              {/* Section 1: Tender Overview */}
              <TenderOverviewCard basicInfo={analysisData.basicInformation} />

              {/* Section 2: Important Dates & Timeline */}
              <DeadlineTimeline importantDates={analysisData.importantDates} onOpenSource={handleOpenSourceModal} />

              {/* Section 3: Eligibility & Qualification Criteria */}
              <EligibilityCard eligibility={analysisData.eligibility} onOpenSource={handleOpenSourceModal} />

              {/* Section 4: Financial Requirements & Security Deposits */}
              <FinancialReqsCard financialRequirements={analysisData.financialRequirements} onOpenSource={handleOpenSourceModal} />

              {/* Section 5: Technical Specifications & Scope */}
              <TechnicalReqsCard technicalRequirements={analysisData.technicalRequirements} onOpenSource={handleOpenSourceModal} />

              {/* Section 6: Mandatory Documents Checklist */}
              <MandatoryDocsChecklist mandatoryDocuments={analysisData.mandatoryDocuments} onOpenSource={handleOpenSourceModal} />

              {/* Section 7: Commercial Terms & Penalties */}
              <ContractTermsCard commercialTerms={analysisData.commercialTerms} onOpenSource={handleOpenSourceModal} />

            </div>
          ) : (
            /* Fallback / Summary cards when tender has not been analyzed yet */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-orange-100 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Clause-Level AI Extraction
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extract exact turnover requirements, OEM terms, bank guarantees, and submission checklists with source page attribution.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-orange-100 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Structured JSON Schema
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Converts raw unstructured PDF/DOCX tender files into standardized procurement objects ready for downstream audit.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-orange-100 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Confidence & Source Attribution
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Maintains confidence ratings (0.90+ High, 0.70-0.89 Med) and snippet references so teams can verify original wording.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Raw Document Text Snippet Box */}
      {activeDoc && (
        <div className="glass-card p-6 rounded-2xl border border-orange-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-500" />
              Document Text Excerpt ({activeDoc.originalName})
            </h3>
            <span className="text-xs text-slate-400">
              Ingested on {new Date(activeDoc.uploadedAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-600 bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin">
            {activeDoc.previewSnippet || activeDoc.extractedText?.substring(0, 300) || 'No text excerpt available.'}
          </p>
        </div>
      )}

      {/* Source Verification Modal */}
      <SourceViewModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        sourceData={modalSourceData}
        title={activeDoc?.originalName}
      />

    </div>
  );
};
