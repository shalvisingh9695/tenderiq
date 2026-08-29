import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  TrendingDown, 
  DollarSign, 
  CalendarClock, 
  Award, 
  Lock, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';
import { SAMPLE_TENDERS, RISK_FACTORS_BREAKDOWN } from '../../data/tendersData';
import { getSafeRiskScore, getSafeRiskLabel, extractText } from '../../utils/textHelper';

export const TenderRiskSection = ({ selectedTender = SAMPLE_TENDERS[0], onSelectTender }) => {
  const [currentTenderId, setCurrentTenderId] = useState(selectedTender?.id || SAMPLE_TENDERS[0].id);

  const activeTender = SAMPLE_TENDERS.find((t) => t.id === currentTenderId) || selectedTender || SAMPLE_TENDERS[0];
  const tenderRiskScore = getSafeRiskScore(activeTender, 30);
  const tenderRiskLabel = getSafeRiskLabel(activeTender);

  const getFactorColor = (score) => {
    if (score <= 30) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
    if (score <= 50) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' };
    return { bg: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
  };

  return (
    <section id="risk-analysis-section" className="py-12 lg:py-16 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header with Title & Tender Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
              Section 4 • AI Risk Intelligence Engine
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              7-Factor Legal &amp; Financial Risk Analysis
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Automated clause breakdown scoring liquidated damages, asymmetric termination rights, turnover barriers, and cashflow liabilities.
            </p>
          </div>

          {/* Quick Tender Switcher Pill */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-orange-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 pl-2">Select RFP:</span>
            <select
              value={currentTenderId}
              onChange={(e) => {
                setCurrentTenderId(e.target.value);
                if (onSelectTender) {
                  const t = SAMPLE_TENDERS.find((item) => item.id === e.target.value);
                  if (t) onSelectTender(t);
                }
              }}
              className="bg-orange-50 text-xs font-bold text-orange-950 py-1.5 px-3 rounded-xl border border-orange-200 focus:outline-none cursor-pointer"
            >
              {SAMPLE_TENDERS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.shortAuthority}: {t.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Risk Score & Metric Overview Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Risk Dial / Score Card (4 cols) */}
          <div className="md:col-span-4 soft-tender-card p-6 flex flex-col justify-between space-y-6 bg-gradient-to-br from-white to-orange-50/40">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Composite Risk Index
              </span>
              <h3 className="font-heading font-black text-slate-900 text-lg leading-tight">
                {activeTender.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {activeTender.authority}
              </p>
            </div>

            {/* Circular Gauge Representation */}
            <div className="relative flex flex-col items-center justify-center py-4">
              <div className="w-36 h-36 rounded-full border-8 border-orange-100 flex flex-col items-center justify-center relative shadow-inner bg-white">
                <span className="font-heading font-black text-3xl text-slate-900">
                  {tenderRiskScore}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  out of 100
                </span>
                <div 
                  className={`absolute -bottom-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs ${
                    tenderRiskScore <= 30
                      ? 'bg-emerald-500 text-white'
                      : tenderRiskScore <= 50
                      ? 'bg-amber-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {tenderRiskLabel}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-orange-200/80 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Eligibility Match:</span>
                <span className="text-emerald-700 font-bold">{extractText(activeTender.eligibilityScore, '90')}% Match</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Bid Recommendation:</span>
                <span className="text-slate-900 font-black">{extractText(activeTender.recommendation, 'GO')} BID</span>
              </div>
            </div>
          </div>

          {/* 7-Factor Score Matrix (8 cols) */}
          <div className="md:col-span-8 soft-tender-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider">
                7-Factor Dimension Breakdown
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Automated NLP Extraction
              </span>
            </div>

            <div className="space-y-3.5">
              {RISK_FACTORS_BREAKDOWN.map((factor) => {
                // Dynamically offset factor score based on active tender
                const factorScore = Math.min(
                  100, 
                  Math.max(10, factor.score + (tenderRiskScore > 40 ? 15 : -5))
                );
                const colorMeta = getFactorColor(factorScore);

                return (
                  <div key={factor.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <span>{factor.name}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-md ${colorMeta.badge}`}>
                          {factorScore <= 30 ? 'Low' : factorScore <= 50 ? 'Moderate' : 'High'} ({factorScore}/100)
                        </span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${colorMeta.bg}`}
                        style={{ width: `${factorScore}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {factor.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Red Flags vs Positive Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Red Flags Column */}
          <div className="soft-tender-card p-6 space-y-4 border-red-200/80 bg-red-50/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-black text-slate-900 text-sm">
                  Critical Red Flags &amp; Legal Discrepancies
                </h4>
                <p className="text-[11px] text-slate-500">
                  Clauses requiring legal review or pre-bid query submission
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {activeTender.redFlags?.map((flag, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white border border-red-200/80 flex items-start gap-2.5 text-xs shadow-2xs"
                >
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-800 font-medium leading-relaxed">
                    {flag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Positive Signals Column */}
          <div className="soft-tender-card p-6 space-y-4 border-emerald-200/80 bg-emerald-50/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-black text-slate-900 text-sm">
                  Positive Bid Signals &amp; Favorable Terms
                </h4>
                <p className="text-[11px] text-slate-500">
                  Clauses that safeguard contractor margin and cashflow
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {activeTender.positiveSignals?.map((sig, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white border border-emerald-200/80 flex items-start gap-2.5 text-xs shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-800 font-medium leading-relaxed">
                    {sig}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
