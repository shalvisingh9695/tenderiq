import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Cpu, Sparkles, FileSearch, Zap, ArrowUpRight } from 'lucide-react';
import heroImage from '../assets/images/hero_dashboard_illustration_1786553496451.jpg';

export const HomePage = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12">
        {/* Soft background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200/40 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-200/30 rounded-full filter blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/60 text-orange-800 text-xs font-semibold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Next-Gen Procurement Intelligence</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Analyze Tenders <br className="hidden sm:inline" />
                <span className="text-gradient-orange">Intelligently with AI</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Make smarter bidding decisions using AI-powered insights. Extract crucial terms, evaluate contract risks, and calculate win probability instantly.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onNavigate('upload')}
                  className="btn-primary-orange px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 cursor-pointer group shadow-lg shadow-orange-500/25"
                >
                  Upload Tender
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-4 rounded-xl text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-base flex items-center justify-center gap-2 shadow-2xs transition-all hover:border-orange-200"
                >
<<<<<<< HEAD
                  Open Dashboard
=======
                  View Demo Dashboard
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Highlights Checklist */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Instant Multi-Format Parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Automated Risk Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Bid vs. No-Bid Guidance</span>
                </div>
              </div>

            </div>

            {/* Right Column: Minimal Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="glass-card rounded-2xl p-3 border border-orange-100/80 shadow-2xl relative group">
                  <img
                    src={heroImage}
                    alt="TenderIQ AI Dashboard Preview"
                    className="w-full h-auto rounded-xl object-cover shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating SaaS Widget Badge */}
                  <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-orange-100 shadow-xl flex items-center gap-3 hidden sm:flex">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">AI Analysis Ready</p>
                      <p className="text-[11px] text-slate-500">Fast 2.4s ingestion pipeline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE CARDS OVERVIEW SECTION */}
      <section className="bg-[#FFF7ED]/40 py-12 my-6 rounded-3xl border border-orange-100/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Streamlined Procurement Pipeline
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Built for enterprise proposal teams, contractors, and legal assessors to eliminate manual document reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Structured Extraction
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Automatically parses submission deadlines, estimated budgets, penalties, and technical compliance prerequisites from lengthy RFPs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Risk Identification
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Detects strict liability clauses, indemnities, unusual payment terms, and tight SLAs to safeguard your company margin.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Decision Recommendation
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Provides actionable Bid/No-Bid recommendations backed by confidence percentages and concise executive summaries.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
