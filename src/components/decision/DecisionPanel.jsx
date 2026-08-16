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
<<<<<<< HEAD
  Edit3,
  Check,
  Clock,
  Briefcase,
  HelpCircle,
  ArrowRight
=======
  Edit3
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
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
<<<<<<< HEAD
    eligibilityMatchScore = 75,
    riskImpactScore = 70,
    financialFitScore = 80,
    complianceScore = 85,
    confidence = 0.92,
=======
    eligibilityMatchScore = 0,
    riskImpactScore = 0,
    financialFitScore = 0,
    complianceScore = 0,
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    decisionSummary = '',
    strengths = [],
    weaknesses = [],
    criticalGaps = []
  } = decisionData;

<<<<<<< HEAD
  // Derive extra breakdown scores cleanly if missing
  const technicalScore = Math.round((eligibilityMatchScore * 0.6) + (complianceScore * 0.4));
  const timelineScore = Math.round((complianceScore * 0.5) + (riskImpactScore * 0.5));

  // Map recommendation to GO / REVIEW / NO-GO
  const getRecommendationBadge = (rec) => {
    const r = (rec || '').toLowerCase();
    if (r === 'apply' || r === 'go') {
      return {
        code: 'GO',
        title: 'FINAL RECOMMENDATION: GO',
        badgeClass: 'bg-emerald-500 text-white shadow-xs',
        icon: CheckCircle2,
        subtext: 'High Qualification Match & Favorable Financial Fit',
        nextAction: 'Proceed with bid document preparation and tender submission fee deposit.'
      };
    }
    if (r === 'avoid' || r === 'no-go' || r === 'nogo') {
      return {
        code: 'NO-GO',
        title: 'FINAL RECOMMENDATION: NO-GO',
        badgeClass: 'bg-rose-600 text-white shadow-xs',
        icon: XCircle,
        subtext: 'High Risk Exposure / Mandatory Requirement Failure',
        nextAction: 'Re-evaluate bid resource allocation. Seek formal clarification or decline.'
      };
    }
    return {
      code: 'REVIEW',
      title: 'FINAL RECOMMENDATION: REVIEW',
      badgeClass: 'bg-amber-500 text-white shadow-xs',
      icon: AlertTriangle,
      subtext: 'Conditional Alignment — Key Verification Required',
      nextAction: 'Conduct bid committee review on technical eligibility & EMD commitments prior to final decision.'
    };
  };

  const recInfo = getRecommendationBadge(recommendation);
  const RecIcon = recInfo.icon;
  const confidencePercent = Math.round((confidence || 0.92) * 100);

  // Win / Decision score gauge color
  const getScoreColor = (prob) => {
    if (prob >= 70) return 'text-emerald-600 stroke-emerald-500';
=======
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
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    if (prob >= 45) return 'text-amber-600 stroke-amber-500';
    return 'text-rose-600 stroke-rose-500';
  };

  return (
    <div id="decision-panel-container" className="space-y-6">
<<<<<<< HEAD
      
      {/* Top Banner: Prominent Recommendation & Decision Score */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-orange-200/90 bg-gradient-to-br from-white via-orange-50/20 to-white shadow-xs space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
          
          {/* Left: Recommendation Badge & Explanation */}
          <div className="space-y-4 flex-1">
            
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2 ${recInfo.badgeClass}`}>
                <RecIcon className="w-4 h-4" />
                {recInfo.code}
              </span>

              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                {confidencePercent}% AI Confidence Level
=======
      {/* Top Banner: Recommendation & Win Probability */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-orange-100 bg-gradient-to-br from-white via-orange-50/30 to-white shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Recommendation Badge & Explanation */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border ${recConfig.badgeClass}`}>
                <RecIcon className={`w-4 h-4 ${recConfig.iconClass}`} />
                {recConfig.label}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
              </span>
            </div>

            <div>
<<<<<<< HEAD
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {recInfo.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                {recInfo.subtext}
              </p>
            </div>

            {/* Recommended Next Action Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Recommended Next Action:
              </span>
              <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{recInfo.nextAction}</span>
              </p>
            </div>

          </div>

          {/* Right: Decision Score Gauge */}
=======
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
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
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
<<<<<<< HEAD
                  className={`transition-all duration-1000 ease-out ${getScoreColor(winProbability)}`}
=======
                  className={`transition-all duration-1000 ease-out ${getWinColor(winProbability)}`}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                  strokeDasharray={`${winProbability}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-heading text-slate-900 tracking-tight">
<<<<<<< HEAD
                  {winProbability}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Decision Score / 100
=======
                  {winProbability}%
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Win Probability
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                </span>
              </div>
            </div>

            {onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
              >
<<<<<<< HEAD
                <Edit3 className="w-3.5 h-3.5" /> Edit Vendor Profile
=======
                <Edit3 className="w-3.5 h-3.5" /> Edit Company Profile
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
              </button>
            )}
          </div>

        </div>
<<<<<<< HEAD

        {/* AI Decision Executive Briefing */}
        {decisionSummary && (
          <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200/80 space-y-1.5 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-900">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Executive Bid Briefing
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {decisionSummary}
            </p>
          </div>
        )}

      </div>

      {/* COMPACT SCORING BREAKDOWN (6 Dimensions) */}
      <div className="glass-card p-6 rounded-2xl border border-orange-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
            Transparent Scoring Breakdown (6 Core Criteria)
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Weighted decision evaluation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Eligibility % */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Eligibility
            </span>
            <span className="font-heading font-extrabold text-slate-900 text-base text-orange-600">
              {eligibilityMatchScore}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">Turnover & Exp</span>
          </div>

          {/* Technical % */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Technical
            </span>
            <span className="font-heading font-extrabold text-slate-900 text-base text-purple-600">
              {technicalScore}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">Specs & OEM</span>
          </div>

          {/* Financial % */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Financial
            </span>
            <span className="font-heading font-extrabold text-slate-900 text-base text-emerald-600">
              {financialFitScore}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">EMD & Guarantee</span>
          </div>

          {/* Documentation % */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Documentation
            </span>
            <span className="font-heading font-extrabold text-slate-900 text-base text-blue-600">
              {complianceScore}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">Checklist Ease</span>
          </div>

          {/* Timeline % */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Timeline
            </span>
            <span className="font-heading font-extrabold text-slate-900 text-base text-indigo-600">
              {timelineScore}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">Execution Window</span>
          </div>

          {/* Risk % */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Risk Suitability
            </span>
            <span className="font-heading font-extrabold text-slate-900 text-base text-rose-600">
              {riskImpactScore}%
            </span>
            <span className="text-[10px] text-slate-500 block truncate">Contract Safety</span>
          </div>

        </div>
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      </div>

      {/* Critical Gaps Warning Callout */}
      <CriticalGapsCard criticalGaps={criticalGaps} />

<<<<<<< HEAD
=======
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

>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
      {/* Two Column Section: Strengths vs Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthsCard strengths={strengths} />
        <WeaknessesCard weaknesses={weaknesses} />
      </div>
<<<<<<< HEAD

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    </div>
  );
};
