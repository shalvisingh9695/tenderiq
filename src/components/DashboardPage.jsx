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
  Cpu,
  MessageSquare,
  RefreshCw,
  Clock,
  Building2
} from 'lucide-react';

import { AnalysisStatusHeader } from './intelligence/AnalysisStatusHeader';
import { ExtractionHealthCard } from './intelligence/ExtractionHealthCard';
import { SourceViewModal } from './intelligence/SourceViewModal';
import { BidIntelligenceSummary } from './intelligence/BidIntelligenceSummary';
import { InformationGapsCard } from './intelligence/InformationGapsCard';
import { TenderOverviewCard } from './intelligence/TenderOverviewCard';
import { DeadlineTimeline } from './intelligence/DeadlineTimeline';
import { EligibilityCard } from './intelligence/EligibilityCard';
import { FinancialReqsCard } from './intelligence/FinancialReqsCard';
import { TechnicalReqsCard } from './intelligence/TechnicalReqsCard';
import { MandatoryDocsChecklist } from './intelligence/MandatoryDocsChecklist';
import { ContractTermsCard } from './intelligence/ContractTermsCard';
import { RiskDashboardSection } from './risk/RiskDashboardSection';
import { DecisionSection } from './decision/DecisionSection';
import { ChatAssistant } from './chat/ChatAssistant';
import { DashboardOverview } from './dashboard/DashboardOverview';
import PdfViewerModal from './pdf/PdfViewerModal';
import { safeFetchJson, getApiUrl } from '../utils/apiHelper';

export const DashboardPage = ({ 
  documents = [], 
  onNavigate, 
  onDeleteDocument,
  onUpdateDocument 
}) => {
  const [selectedDocId, setSelectedDocId] = useState(
    documents.length > 0 ? documents[0].id : 'tender-nhai-402'
  );
  const [activeViewTab, setActiveViewTab] = useState('overview'); // 'overview' | 'extraction' | 'risk' | 'decision' | 'chat'

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const [isRiskAnalyzing, setIsRiskAnalyzing] = useState(false);
  const [riskAnalysisError, setRiskAnalysisError] = useState(null);

  // Source View Modal State
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [modalSourceData, setModalSourceData] = useState(null);

  // PDF Viewer Modal State
  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
    fileUrl: null,
    pageNumber: 1,
    highlightText: ''
  });

  const activeDoc = documents.find((doc) => doc.id === selectedDocId) || documents[0] || null;

  const handleOpenSourceModal = (sourceData) => {
    if (!sourceData) return;
    setModalSourceData(sourceData);
    setIsSourceModalOpen(true);
  };

  const handleOpenPdfViewer = ({ fileUrl, page, text }) => {
    setPdfModal({
      isOpen: true,
      fileUrl: fileUrl ? getApiUrl(fileUrl) : (activeDoc ? getApiUrl(activeDoc.fileUrl || `/api/tenders/${activeDoc.id}/file`) : null),
      pageNumber: page || 1,
      highlightText: text || ''
    });
  };

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
      const data = await safeFetchJson(`/api/tenders/${activeDoc.id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      // Update document with structured analysis
      if (data.data && onUpdateDocument) {
        onUpdateDocument(data.data);
      }
    } catch (err) {
      console.error('Tender analysis error:', err);
      setAnalysisError(err.message || 'An error occurred during analysis.');

      if (onUpdateDocument) {
        onUpdateDocument({
          ...activeDoc,
          analysisStatus: 'failed',
          analysisError: err.message || 'Tender analysis failed.'
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Risk Intelligence Endpoint
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
      const data = await safeFetchJson(`/api/tenders/${activeDoc.id}/risk-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

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
  const decisionReport = activeDoc?.decisionReport;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Procurement Intelligence Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-900 border border-orange-200 uppercase tracking-wider">
              TenderIQ AI Engine
            </span>
            
            {/* Status Indicator */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
              currentAnalysisStatus === 'analyzing'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : currentAnalysisStatus === 'completed' || activeDoc?.structuredAnalysis
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                currentAnalysisStatus === 'analyzing' ? 'bg-amber-500 animate-ping' :
                currentAnalysisStatus === 'completed' || activeDoc?.structuredAnalysis ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
              {currentAnalysisStatus === 'analyzing'
                ? 'Analyzing...'
                : currentAnalysisStatus === 'completed' || activeDoc?.structuredAnalysis
                ? 'AI Extracted'
                : 'Ready for AI'}
            </span>
          </div>

          {/* Active Tender Sub-Header Metadata */}
          {activeDoc && (
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium flex-wrap pt-0.5">
              <span className="font-bold text-slate-900 max-w-md truncate" title={activeDoc.originalName}>
                {analysisData?.basicInformation?.title || activeDoc.originalName}
              </span>
              
              {(analysisData?.basicInformation?.organization || analysisData?.basicInformation?.issuingAuthority) && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-500 truncate max-w-xs">
                    <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">
                      {analysisData?.basicInformation?.organization || analysisData?.basicInformation?.issuingAuthority}
                    </span>
                  </span>
                </>
              )}

              {activeDoc.analyzedAt && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Analyzed: {new Date(activeDoc.analyzedAt).toLocaleString()}</span>
                  </span>
                </>
              )}
            </div>
          )}

          <p className="text-slate-500 text-xs sm:text-sm">
            Clause-level extraction, eligibility rules, risk intelligence, decision support, and RAG chat.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
          {activeDoc && (
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 hover:border-orange-300 inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="Re-run Gemini AI Clause Analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('upload')}
            className="btn-primary-orange px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Upload className="w-4 h-4" />
            Upload New Document
          </button>
        </div>
      </div>

      {/* Active Document Selector Bar */}
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

      {/* EXECUTIVE SUMMARY: BID INTELLIGENCE BRIEF */}
      {activeDoc && (
        <BidIntelligenceSummary
          activeDoc={activeDoc}
          analysisData={analysisData}
          riskReport={riskReport}
          decisionReport={decisionReport}
          onNavigateTab={(tab) => setActiveViewTab(tab)}
        />
      )}

      {/* Sub-Navigation Tabs: Overview vs. Extraction vs. Risk Intelligence vs Decision Engine vs Chat */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 flex-wrap">
        <button
          onClick={() => setActiveViewTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeViewTab === 'overview'
              ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
              : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Overview</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 text-white font-mono">
            SaaS Grid
          </span>
        </button>

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
          <span>Decision Engine</span>
          {decisionReport ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              decisionReport.recommendation === 'Apply' || decisionReport.recommendation === 'GO'
                ? 'bg-emerald-100 text-emerald-800'
                : decisionReport.recommendation === 'Avoid' || decisionReport.recommendation === 'NO-GO'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {decisionReport.recommendation === 'Apply' ? 'GO' : decisionReport.recommendation === 'Avoid' ? 'NO-GO' : decisionReport.recommendation || 'REVIEW'}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-900 uppercase">
              Evaluator
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveViewTab('chat')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeViewTab === 'chat'
              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-xs'
              : 'bg-white/60 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Assistant</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-900 uppercase">
            RAG Chat
          </span>
        </button>
      </div>

      {/* VIEW RENDER: OVERVIEW, EXTRACTION, RISK, DECISION ENGINE, OR CHAT */}
      {activeViewTab === 'overview' ? (
        <DashboardOverview
          documents={documents}
          activeDoc={activeDoc}
          selectedDocId={selectedDocId}
          onSelectDoc={(id) => setSelectedDocId(id)}
          onNavigate={onNavigate}
          onDeleteDocument={onDeleteDocument}
          onRunAnalysis={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
          onOpenPdfViewer={handleOpenPdfViewer}
          onOpenSourceModal={handleOpenSourceModal}
          onSwitchTab={(tab) => setActiveViewTab(tab)}
        />
      ) : activeViewTab === 'chat' ? (
        <ChatAssistant
          tenderId={activeDoc?.id}
          documentTitle={activeDoc?.originalName}
          fileUrl={activeDoc?.fileUrl || `/api/tenders/${activeDoc?.id}/file`}
        />
      ) : activeViewTab === 'decision' ? (
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
          onOpenSource={(src) => {
            handleOpenSourceModal(src);
            if (src?.page) {
              handleOpenPdfViewer({
                fileUrl: activeDoc?.fileUrl || `/api/tenders/${activeDoc?.id}/file`,
                page: src.page,
                text: src.sourceText || src.value
              });
            }
          }}
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

              {/* INFORMATION GAPS SECTION */}
              <InformationGapsCard
                informationGaps={analysisData.informationGaps || analysisData.ambiguousClauses || []}
                missingFields={analysisData.extractionHealth?.missingFields || []}
                onOpenPdf={handleOpenPdfViewer}
              />

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
        onOpenPdf={handleOpenPdfViewer}
      />

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal((prev) => ({ ...prev, isOpen: false }))}
        fileUrl={pdfModal.fileUrl}
        pageNumber={pdfModal.pageNumber}
        highlightText={pdfModal.highlightText}
      />

    </div>
  );
};
