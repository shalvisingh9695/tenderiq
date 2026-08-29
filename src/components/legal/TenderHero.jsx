import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UploadCloud, 
  Bot, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Cpu, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  FileCheck2, 
  Scale, 
  ChevronRight,
  Layers,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export const TenderHero = ({ 
  onUploadTrigger, 
  onTryAIChat, 
  onExploreTenders,
  onNavigate 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onExploreTenders) onExploreTenders();
  };

  const quickFilterPills = [
    'NHAI Expressways',
    'Smart Power Grids',
    'Defense Radars',
    'Metro Rail EPC',
    'Hospital ERP'
  ];

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-14 lg:pb-20 bg-gradient-to-b from-orange-100/70 via-amber-50/40 to-[#FAF9F6]">
      
      {/* ========================================================================= */}
      {/* LIGHT ORANGE AMBIENT GRADIENT & BACKGROUND LIGHTS */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-orange-400/20 via-amber-300/15 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-orange-300/15 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-10 right-0 w-96 h-96 bg-amber-400/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* ========================================================================= */}
      {/* FLOATING ICONS: DOCUMENTS, AI, AND CHARTS */}
      {/* ========================================================================= */}
      
      {/* Floating Icon 1: Documents (Top Left) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ 
          opacity: 1, 
          y: [0, -12, 0],
          rotate: [0, 3, -2, 0]
        }}
        transition={{ 
          opacity: { duration: 0.6 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="hidden lg:flex absolute top-12 left-10 xl:left-20 z-10 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.15)] pointer-events-none"
      >
        <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
          <FileText className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black text-slate-800 leading-tight">350+ Page RFPs</p>
          <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">Multi-doc parser</p>
        </div>
      </motion.div>

      {/* Floating Icon 2: AI Core (Top Right) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ 
          opacity: 1, 
          y: [0, -14, 0],
          rotate: [0, -4, 2, 0]
        }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.2 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }}
        className="hidden lg:flex absolute top-10 right-10 xl:right-24 z-10 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.18)] pointer-events-none"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black text-slate-800 leading-tight">Legal AI Engine</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Clause Extractor</p>
        </div>
      </motion.div>

      {/* Floating Icon 3: Charts & Analytics (Mid/Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ 
          opacity: 1, 
          y: [0, 10, 0],
          rotate: [0, 2, -3, 0]
        }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.3 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        className="hidden xl:flex absolute bottom-24 left-8 z-10 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-orange-200/70 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.12)] pointer-events-none"
      >
        <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
          <BarChart3 className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black text-slate-800 leading-tight">7-Factor Risk Index</p>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Dynamic analytics</p>
        </div>
      </motion.div>

      {/* Floating Icon 4: Predictive Financial Chart (Mid Right) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ 
          opacity: 1, 
          y: [0, 12, 0],
          rotate: [0, -3, 2, 0]
        }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
          rotate: { duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }
        }}
        className="hidden xl:flex absolute bottom-28 right-8 z-10 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-200/80 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.12)] pointer-events-none"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
          <TrendingUp className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black text-slate-800 leading-tight">₹12,400+ Cr Bids</p>
          <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Optimal win-rate</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* HERO CONTENT: TWO COLUMN CLEAN SAAS LAYOUT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtext, Buttons, Quick Search */}
          <motion.div 
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Top Version Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-900 text-xs font-bold shadow-2xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
              </span>
              <span className="font-extrabold tracking-wider uppercase text-[10px] text-orange-800">
                Procurement Intelligence Platform
              </span>
              <span className="text-orange-300 font-normal">•</span>
              <span className="text-[11px] text-orange-700 font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3 text-orange-600" /> Enterprise v3.2
              </span>
            </div>

            {/* Main Headline (Requested exact title with high-contrast styling) */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              AI Powered{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Tender Intelligence
              </span>
            </h1>

            {/* Subtext (Requested exact wording & clean context) */}
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-medium">
              Analyze tenders, detect risks, and make smarter decisions.
            </p>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
              Extract turnover requirements, calculate EMD guarantees, detect hidden liquidated damages, and query complex RFPs with source-verified citations in seconds.
            </p>

            {/* ========================================================================= */}
            {/* MAIN CTA BUTTONS (Upload Tender + Try AI Chat) */}
            {/* ========================================================================= */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              
              {/* Button 1: Upload Tender (Primary with Orange Glow Effect) */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (onUploadTrigger) {
                    onUploadTrigger();
                  } else if (onNavigate) {
                    onNavigate('upload');
                  }
                }}
                className="btn-orange-pill btn-glow-effect px-7 py-3.5 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 tracking-wide"
              >
                <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                <span>Upload Tender</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Button 2: Try AI Chat (Secondary with Clean SaaS Styling) */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (onTryAIChat) {
                    onTryAIChat();
                  } else {
                    const el = document.getElementById('ai-chat-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 border-2 border-slate-200/90 hover:border-orange-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md"
              >
                <Bot className="w-4 h-4 text-orange-600" />
                <span>Try AI Chat</span>
              </motion.button>

            </div>

            {/* Search & Sector Bar */}
            <form 
              onSubmit={handleSearchSubmit}
              className="p-2 rounded-3xl bg-white shadow-lg shadow-orange-500/5 border border-orange-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl"
            >
              <div className="sm:w-40 flex-shrink-0 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-slate-200 flex items-center justify-between">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All Sectors">All Sectors</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Energy & Grids">Energy &amp; Power</option>
                  <option value="Defense">Defense Systems</option>
                  <option value="Telecom & IT">Telecom &amp; Cloud</option>
                </select>
              </div>

              <div className="flex-1 flex items-center gap-2 px-3 py-1">
                <Search className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search live RFPs by title, NIT number..."
                  className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="btn-orange-pill px-5 py-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Pills */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs pt-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                Trending RFPs:
              </span>
              {quickFilterPills.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(pill);
                    if (onExploreTenders) onExploreTenders();
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-700 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Key Trust Counters */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-orange-200/60 max-w-xl">
              <div className="p-2.5 rounded-2xl bg-white/80 border border-orange-100 shadow-2xs">
                <p className="font-heading text-base sm:text-lg font-black text-slate-900">
                  ₹12,400+ Cr
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Bids Audited</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 border border-orange-100 shadow-2xs">
                <p className="font-heading text-base sm:text-lg font-black text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 99.4%
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Extraction Accuracy</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 border border-orange-100 shadow-2xs">
                <p className="font-heading text-base sm:text-lg font-black text-orange-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> &lt; 30s
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Risk Score Time</p>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Live Tender Intelligence Interactive Showcase Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-orange-500/25 via-amber-400/20 to-orange-600/10 blur-xl pointer-events-none" />

            {/* Interactive Showcase Card */}
            <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-orange-400 via-amber-300 to-orange-500 shadow-2xl">
              <div className="bg-white rounded-[22.5px] p-6 space-y-5">
                
                {/* Card Top: Active Document Badge & Recommendation */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                      <FileText className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-black uppercase tracking-wider">
                          NIT #2026/EPC-04
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          348 Pages
                        </span>
                      </div>
                      <h4 className="font-heading text-sm sm:text-base font-black text-slate-900 leading-snug mt-0.5">
                        NHAI Express Highway (Pkg-4)
                      </h4>
                    </div>
                  </div>

                  {/* Recommendation Pill */}
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black tracking-wide flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> GO BID
                  </span>
                </div>

                {/* Key Metric Highlights Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Budget / Value
                    </p>
                    <p className="font-heading text-base sm:text-lg font-black text-slate-900">
                      ₹420.0 Crore
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium">EMD: ₹8.4 Cr (2%)</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-1">
                    <p className="text-[10px] font-extrabold text-orange-800 uppercase tracking-wider">
                      Risk Index
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-heading text-base sm:text-lg font-black text-orange-600">
                        28 / 100
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Low Risk
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">7 Factors Scored</span>
                  </div>
                </div>

                {/* Extracted Clauses Traceable */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Extracted Legal Clauses</span>
                    <span className="text-orange-600 font-semibold normal-case">Verified Page Citations</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <Scale className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800">Liquidated Damages: 10% max</p>
                        <p className="text-[10px] text-slate-500">Clause 18.2 • Page 74 • Standard NHAI template</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800">Mobilization Advance: 10% @ 8.5%</p>
                        <p className="text-[10px] text-slate-500">Clause 14.1 • Page 42 • Against Bank Guarantee</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (onExploreTenders) {
                        onExploreTenders();
                      } else {
                        const el = document.getElementById('tender-insights-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <span>Inspect Full Live RFP Dossier</span>
                    <ChevronRight className="w-4 h-4 text-orange-400" />
                  </motion.button>
                </div>

              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
