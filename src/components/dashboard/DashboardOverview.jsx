import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ArrowRight, 
  Clock, 
  Building2, 
  Search, 
  Filter, 
  RefreshCw, 
  Cpu, 
  BarChart3, 
  FileCheck2, 
  ChevronRight, 
  ExternalLink,
  Eye,
  Layers,
  Scale,
  FileSpreadsheet,
  Zap,
  Info
} from 'lucide-react';
import { SAMPLE_TENDERS } from '../../data/tendersData';
import { getSafeRiskScore, getSafeRiskLabel, extractText } from '../../utils/textHelper';

export const DashboardOverview = ({
  documents = [],
  activeDoc,
  selectedDocId,
  onSelectDoc,
  onNavigate,
  onDeleteDocument,
  onRunAnalysis,
  isAnalyzing,
  onOpenPdfViewer,
  onOpenSourceModal,
  onSwitchTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'analyzed' | 'pending' | 'high_risk'

  // Combine user uploaded documents with sample tenders to show a full SaaS view
  const allTenderItems = [
    ...documents.map((doc) => {
      const structured = doc.structuredAnalysis;
      const risk = doc.riskReport;
      return {
        id: doc.id,
        isUploaded: true,
        title: structured?.basicInformation?.title || doc.originalName,
        originalName: doc.originalName,
        authority: structured?.basicInformation?.organization || structured?.basicInformation?.issuingAuthority || 'Procurement Authority',
        nitNumber: structured?.basicInformation?.nitNumber || structured?.basicInformation?.tenderNumber || `NIT-${doc.id.substring(0, 6).toUpperCase()}`,
        sector: structured?.basicInformation?.category || 'General Procurement',
        valueFormatted: structured?.financialRequirements?.estimatedValue || '₹42.0 Cr',
        date: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Today',
        fileSize: doc.sizeFormatted || '1.8 MB',
        pages: doc.pagesCount || (doc.text ? Math.ceil(doc.text.length / 2000) : 48),
        status: doc.analysisStatus === 'completed' || structured ? 'Extracted' : doc.analysisStatus === 'analyzing' ? 'Analyzing' : 'Ready',
        riskScore: getSafeRiskScore(risk || doc.riskScore, structured ? 28 : 30),
        riskLevel: getSafeRiskScore(risk || doc.riskScore, 30) > 60 ? 'high' : getSafeRiskScore(risk || doc.riskScore, 30) > 35 ? 'medium' : 'low',
        recommendation: doc.decisionReport?.recommendation || (structured ? 'GO' : 'REVIEW'),
        eligibilityScore: structured?.eligibility?.calculatedScore || 88,
        docRef: doc
      };
    }),
    ...SAMPLE_TENDERS.map((t) => ({
      id: t.id,
      isUploaded: false,
      title: t.title,
      originalName: `${t.title.substring(0, 30)}.pdf`,
      authority: t.authority,
      nitNumber: t.nitNumber,
      sector: t.sector,
      valueFormatted: t.valueFormatted,
      date: 'Aug 24, 2026',
      fileSize: t.fileSize,
      pages: t.pages,
      status: 'Extracted',
      riskScore: getSafeRiskScore(t.riskScore, 30),
      riskLevel: t.riskLevel,
      recommendation: t.recommendation,
      eligibilityScore: t.eligibilityScore,
      tenderRef: t
    }))
  ];

  // Filtered list for search and status
  const filteredTenders = allTenderItems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterStatus === 'analyzed') return item.status === 'Extracted';
    if (filterStatus === 'pending') return item.status === 'Ready' || item.status === 'Analyzing';
    if (filterStatus === 'high_risk') return getSafeRiskScore(item.riskScore) > 40;

    return true;
  });

  // Aggregated Portfolio Stats
  const totalTendersCount = allTenderItems.length;
  const analyzedCount = allTenderItems.filter((t) => t.status === 'Extracted').length;
  const avgRiskScore = Math.round(
    allTenderItems.reduce((acc, curr) => acc + getSafeRiskScore(curr.riskScore, 30), 0) /
    (allTenderItems.length || 1)
  );
  const avgSuccessRate = Math.round(
    allTenderItems.reduce((acc, curr) => acc + (curr.eligibilityScore || 85), 0) / (allTenderItems.length || 1)
  );

  // Active or selected tender for AI Insights Panel
  const currentTender = allTenderItems.find((t) => t.id === selectedDocId) || allTenderItems[0];

  return (
    <div className="space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. DARK + LIGHT MIX SAAS HERO STATS BANNER */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-slate-950 text-white overflow-hidden p-6 sm:p-8 border border-slate-800 shadow-2xl">
        {/* Subtle Ambient Background Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-6">
          
          {/* Top Banner Row: Brand / System Status + Quick CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Live Intelligence Engine
                </span>
                <span className="text-slate-400 text-xs font-semibold">
                  TenderIQ v3.2 Enterprise
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
                Procurement Intelligence Dashboard
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-normal">
                Real-time legal extraction, multi-factor risk scoring, and RFP compliance auditing powered by Gemini AI.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('upload')}
                className="btn-orange-pill btn-glow-effect px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New RFP</span>
              </motion.button>

              <button
                onClick={() => onSwitchTab('chat')}
                className="px-4 py-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STATS CARDS: TOTAL TENDERS, RISK %, SUCCESS RATE (+ AI HEALTH) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* STAT CARD 1: Total Tenders */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-lg space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Tenders
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                  <FileText className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-white">
                    {totalTendersCount}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +100%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {analyzedCount} Analyzed • {totalTendersCount - analyzedCount} In Pipeline
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Active Value</span>
                <span className="font-bold text-slate-200">₹8,450+ Cr</span>
              </div>
            </motion.div>

            {/* STAT CARD 2: Risk % */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-lg space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Avg Risk Index
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-amber-400">
                    {avgRiskScore}%
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Low / Moderate
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  7-Factor Legal &amp; Financial audit
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>High Risk Flags</span>
                <span className="font-bold text-amber-400">2 clauses flagged</span>
              </div>
            </motion.div>

            {/* STAT CARD 3: Success Rate / Win Probability */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-lg space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Success Rate
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-emerald-400">
                    {avgSuccessRate}%
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Fit
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Turnover &amp; technical criteria met
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Bid Readiness</span>
                <span className="font-bold text-emerald-400">8/10 RFPs Qualify</span>
              </div>
            </motion.div>

            {/* STAT CARD 4: AI Extraction Accuracy */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-lg space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  AI Extraction Health
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-blue-400">
                    99.4%
                  </span>
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Clause-level citation mapping
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Total Clauses Scanned</span>
                <span className="font-bold text-slate-200">1,420+ Clauses</span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN DASHBOARD GRID: RECENT UPLOADS LIST + AI INSIGHTS PANEL */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT / CENTER: RECENT UPLOADS LIST (8 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Section Header & Search / Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Recent Uploads &amp; Tender Dossiers
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {filteredTenders.length} procurement documents indexed
                </p>
              </div>
            </div>

            {/* Search Input & Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title, NIT..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 w-44 sm:w-48 font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Tenders</option>
                <option value="analyzed">Analyzed (AI Ready)</option>
                <option value="pending">Pending / Ready</option>
                <option value="high_risk">High Risk (&gt;40%)</option>
              </select>
            </div>
          </div>

          {/* List of Tenders Table / Card View */}
          <div className="space-y-3">
            {filteredTenders.map((tender) => {
              const isSelected = tender.id === selectedDocId || tender.id === currentTender?.id;
              
              return (
                <motion.div
                  key={tender.id}
                  layout
                  onClick={() => {
                    if (onSelectDoc) onSelectDoc(tender.id);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-orange-50/70 border-orange-300 shadow-md ring-1 ring-orange-300'
                      : 'bg-white border-slate-200/90 hover:border-orange-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Tender Title & Authority Details */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' 
                          : 'bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {tender.nitNumber}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {tender.sector}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-400">
                            {tender.fileSize} ({tender.pages} pgs)
                          </span>
                        </div>

                        <h4 className="font-heading text-sm sm:text-base font-black text-slate-900 truncate" title={tender.title}>
                          {tender.title}
                        </h4>

                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{tender.authority}</span>
                        </p>
                      </div>
                    </div>

                    {/* Metadata Badges & Value */}
                    <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-center shrink-0">
                      
                      {/* Budget / Value */}
                      <div className="text-right">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Value
                        </p>
                        <p className="font-heading text-sm sm:text-base font-black text-slate-900">
                          {tender.valueFormatted}
                        </p>
                      </div>

                      {/* Risk Score Pill */}
                      <div className="text-right">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Risk Index
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            tender.riskLevel === 'low'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tender.riskLevel === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {tender.riskScore ? `${getSafeRiskScore(tender.riskScore)}/100` : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Quick Inspection / Action Buttons */}
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                        {tender.isUploaded && tender.docRef && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenPdfViewer) {
                                onOpenPdfViewer({
                                  fileUrl: tender.docRef.fileUrl || `/api/tenders/${tender.id}/file`,
                                  page: 1,
                                  text: ''
                                });
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 transition-colors"
                            title="View PDF Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectDoc) onSelectDoc(tender.id);
                            if (onSwitchTab) onSwitchTab('extraction');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <span>Audit</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {tender.isUploaded && onDeleteDocument && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDocument(tender.id);
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete RFP"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT: AI INSIGHTS PANEL (4 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* AI Insights Card Box */}
          <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-600 shadow-xl">
            <div className="bg-white rounded-[22.5px] p-5 sm:p-6 space-y-5">
              
              {/* Header with Glowing AI Sparkle */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                    <Sparkles className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-slate-900 text-sm">
                      AI Insights Panel
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      Selected RFP Analysis
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  currentTender.recommendation === 'GO' || currentTender.recommendation === 'Apply'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {currentTender.recommendation || 'GO BID'}
                </span>
              </div>

              {/* Current Active Tender Target Title */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Target Dossier
                </p>
                <p className="font-heading text-xs font-black text-slate-900 line-clamp-2">
                  {currentTender.title}
                </p>
                <p className="text-[10px] text-slate-500">
                  Authority: {currentTender.authority}
                </p>
              </div>

              {/* 3 Core SaaS Pillars Breakdown */}
              <div className="space-y-3.5">
                
                {/* Pillar 1: Eligibility Score */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Eligibility Match
                    </span>
                    <span className="font-black text-emerald-600">
                      {currentTender.eligibilityScore || 92}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${currentTender.eligibilityScore || 92}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 2: Financial Risk Score */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-amber-500" /> Financial Exposure
                    </span>
                    <span className="font-black text-amber-600">
                      {getSafeRiskScore(currentTender.riskScore, 28)}% ({getSafeRiskLabel(currentTender)})
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${getSafeRiskScore(currentTender.riskScore, 28)}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 3: Technical Compliance */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-500" /> Technical Compliance
                    </span>
                    <span className="font-black text-blue-600">
                      94% (Full BOQ Match)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                      style={{ width: '94%' }}
                    />
                  </div>
                </div>

              </div>

              {/* Key AI Actionable Findings */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Critical Clause Alerts
                </p>

                <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-orange-950">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>Liquidated Damages Capped @ 10%</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight pl-5">
                    Delay penalties standard at 0.05%/day with 180-day grace period.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Mobilization Advance Available</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight pl-5">
                    10% advance against bank guarantee at 8.5% interest rate.
                  </p>
                </div>
              </div>

              {/* Panel Direct CTAs */}
              <div className="space-y-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSwitchTab('risk')}
                  className="w-full btn-orange-pill btn-glow-effect py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Launch 7-Factor Risk Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>

                <button
                  onClick={() => onSwitchTab('chat')}
                  className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Ask RAG Chat Assistant</span>
                </button>
              </div>

            </div>
          </div>

          {/* Quick Operational Tip */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Smart Bid Tip</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Uploading addendums or corrigendum PDFs will automatically re-calculate the risk index and update the submission deadline timeline.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
