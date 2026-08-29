import React from 'react';
import { AlertCircle, CheckCircle2, Search, RefreshCw, Shield, ArrowUpRight } from 'lucide-react';
import { RiskScoreMeter } from './RiskScoreMeter';
import { extractText } from '../../utils/textHelper';

export const RiskOverviewCard = ({ riskReport = {}, onReanalyze, isAnalyzing = false, onOpenSource }) => {
  const {
    overallScore = 0,
    overallLevel = 'Moderate',
    executiveSummary,
    topRisks = [],
    topPositiveSignals = [],
    recommendedAreasToInvestigate = []
  } = riskReport;

  const scoreNum = typeof overallScore === 'number' ? overallScore : (parseFloat(extractText(overallScore)) || 0);
  const levelText = extractText(overallLevel, 'Moderate');
  const summaryText = extractText(executiveSummary);

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-100/80 text-orange-700">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="font-heading font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight">
              Risk Intelligence Overview
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 pl-9 font-medium">
            Evidence-backed clause risk scoring & explainable bid risk assessment
          </p>
        </div>

        {onReanalyze && (
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Evaluating Risks...' : 'Re-Run Risk Engine'}
          </button>
        )}
      </div>

      {/* Main Grid: Score Meter + Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Gauge */}
        <div className="lg:col-span-1">
          <RiskScoreMeter score={scoreNum} level={levelText} />
        </div>

        {/* Executive Summary & Key Highlights */}
        <div className="lg:col-span-2 bg-slate-50/80 p-5 rounded-2xl border border-slate-100/90 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Executive Risk Summary
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {summaryText || `Comprehensive clause analysis indicates an overall ${levelText} risk profile (${scoreNum}/100) across financial, legal, and operational parameters.`}
            </p>
          </div>

          {/* Quick Snapshot: Top Risks vs Top Positives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
            {/* Top 3 Risks */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                Primary Risk Factors
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {topRisks.slice(0, 3).map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span className="line-clamp-2 font-medium">{extractText(risk)}</span>
                  </li>
                ))}
                {topRisks.length === 0 && (
                  <li className="text-slate-400 italic">No major risks flagged</li>
                )}
              </ul>
            </div>

            {/* Top 3 Positives */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Favorable Signals
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {topPositiveSignals.slice(0, 3).map((pos, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold shrink-0">•</span>
                    <span className="line-clamp-2 font-medium">{extractText(pos)}</span>
                  </li>
                ))}
                {topPositiveSignals.length === 0 && (
                  <li className="text-slate-400 italic">No major positive signals logged</li>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Areas to Investigate */}
      {recommendedAreasToInvestigate.length > 0 && (
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
          <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            Recommended Investigation Areas for Bid Committee
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {recommendedAreasToInvestigate.map((item, idx) => (
              <div key={idx} className="bg-white/90 p-3 rounded-lg border border-amber-200/60 text-xs text-slate-800 font-medium flex items-start gap-2 shadow-2xs">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{extractText(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

