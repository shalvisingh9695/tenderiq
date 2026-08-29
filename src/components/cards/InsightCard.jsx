import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  DollarSign, 
  Award, 
  ArrowRight, 
  Building2, 
  FileCheck2,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { getSafeRiskScore } from '../../utils/textHelper';

export const InsightCard = ({
  tender,
  onInspectInsights,
  onOpenChat,
  onSelectTender
}) => {
  if (!tender) return null;

  // Calculate dynamic or fallback scores
  const eligibilityScore = tender.eligibilityScore || 92;
  const financialRiskScore = getSafeRiskScore(tender.riskScore, 28);
  const technicalScore = Math.max(70, Math.min(99, 100 - Math.round(financialRiskScore * 0.4) + (eligibilityScore > 90 ? 4 : -2)));

  // Financial risk styling
  const getFinancialRiskMeta = (score) => {
    if (score <= 30) {
      return {
        label: 'Low Financial Risk',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        bar: 'bg-emerald-500',
        desc: 'Capped penalties & progressive billing'
      };
    }
    if (score <= 50) {
      return {
        label: 'Moderate Financial Risk',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        bar: 'bg-amber-500',
        desc: 'Standard liquidated damages (10% max)'
      };
    }
    return {
      label: 'High Financial Exposure',
      badge: 'bg-red-50 text-red-700 border-red-200',
      bar: 'bg-red-500',
      desc: 'Severe delay penalties & high EMD liability'
    };
  };

  const finRisk = getFinancialRiskMeta(financialRiskScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, scale: 1.025 }}
      transition={{ 
        duration: 0.38, 
        ease: [0.22, 1, 0.36, 1],
        scale: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
      }}
      className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-amber-400/70 via-orange-400/50 to-orange-600/20 hover:from-amber-500 hover:via-orange-500 hover:to-orange-600 transition-colors duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_22px_45px_-10px_rgba(249,115,22,0.25)] group flex flex-col h-full cursor-default"
    >
      {/* Inner White Container */}
      <div className="bg-white rounded-[22.5px] p-5 sm:p-6 flex flex-col justify-between h-full space-y-5">
        
        {/* TOP SECTION: Icon on Top + Header Meta */}
        <div className="space-y-4">
          
          {/* Top Bar with Icon on Top & AI Extraction Tag */}
          <div className="flex items-start justify-between gap-3">
            
            {/* Prominent Icon on Top with Golden-Orange Gradient Glow */}
            <motion.div 
              whileHover={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.4 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-300 flex-shrink-0"
            >
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </motion.div>

            {/* Insight Badge */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Cpu className="w-3 h-3 text-orange-600" />
                <span>AI Risk Insight</span>
              </span>
            </div>

          </div>

          {/* Title & Authority Info */}
          <div className="space-y-1">
            <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
              {tender.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{tender.authority}</span>
            </p>
          </div>

          {/* 3 CORE SAAS INSIGHT PILLARS (Eligibility, Financial Risk, Technical Score) */}
          <div className="space-y-3 pt-1">
            
            {/* 1. ELIGIBILITY METRIC PILLAR */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Eligibility Compliance</span>
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 border border-emerald-300/80 px-2 py-0.5 rounded-md">
                  {eligibilityScore}% Match
                </span>
              </div>

              {/* Eligibility Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${eligibilityScore}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                />
              </div>

              <p className="text-[11px] text-slate-500 truncate font-medium">
                Turnover: <strong className="text-slate-700">{tender.turnoverReq || 'Met threshold'}</strong>
              </p>
            </div>

            {/* 2. FINANCIAL RISK PILLAR */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-orange-600" />
                  <span>Financial Risk Assessment</span>
                </span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${finRisk.badge}`}>
                  {financialRiskScore}/100 Score
                </span>
              </div>

              {/* Financial Risk Meter Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${financialRiskScore}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className={`h-full rounded-full ${finRisk.bar}`}
                />
              </div>

              <p className="text-[11px] text-slate-500 font-medium truncate">
                {finRisk.desc}
              </p>
            </div>

            {/* 3. TECHNICAL SCORE PILLAR */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Technical Score Rating</span>
                </span>
                <span className="text-xs font-black text-amber-800 bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 rounded-md">
                  {technicalScore}/100 Rating
                </span>
              </div>

              {/* Technical Score Meter Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${technicalScore}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                />
              </div>

              <p className="text-[11px] text-slate-500 font-medium truncate">
                Past Experience: <strong className="text-slate-700">High match with BOQ specifications</strong>
              </p>
            </div>

          </div>

        </div>

        {/* BOTTOM ACTION BUTTON: Deep Inspection with Glow and Scale Effect */}
        <div className="pt-4 border-t border-slate-100">
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (onInspectInsights) onInspectInsights(tender);
              const el = document.getElementById('risk-analysis-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-md shadow-slate-900/15 hover:shadow-orange-500/35"
          >
            <span>Deep Audit &amp; 7-Factor Risk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};
