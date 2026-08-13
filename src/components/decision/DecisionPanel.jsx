import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ShieldAlert,
  Award,
  FileCheck2,
  Sparkles,
  Edit3
} from 'lucide-react';

import { DecisionScoreCard } from './DecisionScoreCard';
import { StrengthsCard } from './StrengthsCard';
import { WeaknessesCard } from './WeaknessesCard';
import { CriticalGapsCard } from './CriticalGapsCard';

export const DecisionPanel = ({ decisionData, onEditProfile, tenderTitle }) => {
  if (!decisionData) return null;

  const {
    recommendation = 'Consider',
    winProbability = 50,
    eligibilityMatchScore = 0,
    riskImpactScore = 0,
    financialFitScore = 0,
    complianceScore = 0,
    decisionSummary = '',
    strengths = [],
    weaknesses = [],
    criticalGaps = []
  } = decisionData;

  // Recommendation Badge Configurations
  const recConfigs = {
    Apply: {
      label: 'APPLY FOR TENDER',
      badgeClass: 'bg-emerald-100/90 text-emerald-900 border-emerald-300 ring-2 ring-emerald-500/20',
      icon: CheckCircle2,
      iconClass: 'text-emerald-700',
      description: 'High qualification alignment, favorable financial fit, and manageable risk profile.'
    },
    Consider: {
      label: 'CONSIDER WITH MITIGATION',
      badgeClass: 'bg-amber-100/90 text-amber-900 border-amber-300 ring-2 ring-amber-500/20',
      icon: AlertTriangle,
      iconClass: 'text-amber-700',
      description: 'Moderate suitability. Proceed with conditional risk safeguards and margin protections.'
    },
    Avoid: {
      label: 'AVOID / DO NOT BID',
      badgeClass: 'bg-rose-100/90 text-rose-900 border-rose-300 ring-2 ring-rose-500/20',
      icon: XCircle,
      iconClass: 'text-rose-700',
      description: 'High disqualification exposure or unmitigated risk burden identified.'
    }
  };

  const recConfig = recConfigs[recommendation] || recConfigs.Consider;
  const RecIcon = recConfig.icon;

  // Probability ring color
  const getWinColor = (prob) => {
    if (prob >= 75) return 'text-emerald-600 stroke-emerald-500';
    if (prob >= 45) return 'text-amber-600 stroke-amber-500';
    return 'text-rose-600 stroke-rose-500';
  };

  return (
    <div id="decision-panel-container" className="space-y-6">
      {/* Top Banner: Recommendation & Win Probability */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-orange-100 bg-gradient-to-br from-white via-orange-50/30 to-white shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Recommendation Badge & Explanation */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border ${recConfig.badgeClass}`}>
                <RecIcon className={`w-4 h-4 ${recConfig.iconClass}`} />
                {recConfig.label}
              </span>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 leading-tight">
                Bid Decision Recommendation
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {recConfig.description}
              </p>
            </div>

            {/* AI Executive Decision Briefing */}
            {decisionSummary && (
              <div className="p-4 rounded-xl bg-orange-50/90 border border-orange-200 space-y-1.5 relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-800">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  AI Executive Decision Briefing
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {decisionSummary}
                </p>
              </div>
            )}
          </div>

          {/* Right: Win Probability Gauge Meter */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs min-w-[220px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`transition-all duration-1000 ease-out ${getWinColor(winProbability)}`}
                  strokeDasharray={`${winProbability}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-heading text-slate-900 tracking-tight">
                  {winProbability}%
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Win Probability
                </span>
              </div>
            </div>

            {onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Company Profile
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Critical Gaps Warning Callout */}
      <CriticalGapsCard criticalGaps={criticalGaps} />

      {/* Score Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DecisionScoreCard
          title="Eligibility Match"
          score={eligibilityMatchScore}
          icon={Award}
          color="orange"
          description="Turnover, experience & certification criteria alignment"
        />
        <DecisionScoreCard
          title="Risk Impact"
          score={riskImpactScore}
          icon={ShieldAlert}
          color="rose"
          description="Suitability score based on overall contract risk burden"
        />
        <DecisionScoreCard
          title="Financial Fit"
          score={financialFitScore}
          icon={TrendingUp}
          color="emerald"
          description="Bank guarantee & collateral vs turnover ratio"
        />
        <DecisionScoreCard
          title="Compliance Score"
          score={complianceScore}
          icon={FileCheck2}
          color="blue"
          description="Document completeness and regulatory ease"
        />
      </div>

      {/* Two Column Section: Strengths vs Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthsCard strengths={strengths} />
        <WeaknessesCard weaknesses={weaknesses} />
      </div>
    </div>
  );
};
