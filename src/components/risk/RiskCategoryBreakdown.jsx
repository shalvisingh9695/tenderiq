import React from 'react';
<<<<<<< HEAD
import {
  DollarSign,
  Scale,
  Wrench,
  Award,
  FileCheck,
  Layers,
  Clock,
  Briefcase,
  FileText,
  ExternalLink
} from 'lucide-react';

export const RiskCategoryBreakdown = ({ categoryScores = {}, onOpenSource }) => {
  const categories = [
    {
      key: 'eligibilityRisk',
      label: 'Eligibility Risk',
      icon: <Award className="w-4 h-4 text-amber-600" />,
      description: 'Prior turnover thresholds, years of experience, certifications & OEM restrictions'
    },
    {
      key: 'financialRisk',
      label: 'Financial Risk',
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      description: 'EMD, performance bank guarantees, price variation & financial exposure'
    },
    {
      key: 'technicalComplianceRisk',
      fallbackKeys: ['operationalRisk'],
      label: 'Technical Compliance Risk',
      icon: <Wrench className="w-4 h-4 text-purple-600" />,
      description: 'Scope ambiguity, technical specifications, OEM compliance & testing standards'
    },
    {
      key: 'documentationRisk',
      fallbackKeys: ['complianceRisk'],
      label: 'Documentation Risk',
      icon: <FileCheck className="w-4 h-4 text-teal-600" />,
      description: 'Mandatory certificates, affidavits, bid security formats & submission checklists'
    },
    {
      key: 'timelineRisk',
      label: 'Timeline Risk',
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      description: 'Delivery schedule, key milestones, response window & execution deadlines'
    },
    {
      key: 'contractualRisk',
      fallbackKeys: ['legalRisk'],
      label: 'Contractual Risk',
      icon: <Scale className="w-4 h-4 text-indigo-600" />,
      description: 'Liquidated damages, penalty matrices, termination clauses & liability caps'
    },
    {
      key: 'commercialRisk',
      label: 'Commercial Risk',
      icon: <Briefcase className="w-4 h-4 text-rose-600" />,
      description: 'Payment schedules, retention money, price escalation & tax liabilities'
    }
  ];

  const getRiskLevelBadge = (score, explicitLevel) => {
    const s = Math.round(score || 0);
    const lvl = (explicitLevel || '').toUpperCase();

    if (lvl === 'CRITICAL' || s > 75) {
      return {
        label: 'CRITICAL',
        badge: 'bg-red-100 text-red-950 border-red-300 font-extrabold',
        bar: 'bg-red-600'
      };
    }
    if (lvl === 'HIGH' || s > 50) {
      return {
        label: 'HIGH',
        badge: 'bg-orange-100 text-orange-950 border-orange-300 font-extrabold',
        bar: 'bg-orange-500'
      };
    }
    if (lvl === 'MEDIUM' || lvl === 'MODERATE' || s > 25) {
      return {
        label: 'MEDIUM',
        badge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        bar: 'bg-amber-500'
      };
    }
    return {
      label: 'LOW',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      bar: 'bg-emerald-500'
    };
=======
import { DollarSign, Scale, Wrench, Award, FileCheck, Layers } from 'lucide-react';

export const RiskCategoryBreakdown = ({ categoryScores = {} }) => {
  const categories = [
    {
      key: 'financialRisk',
      label: 'Financial Risk',
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      description: 'Turnover, EMD, guarantees, payment terms & financial exposure'
    },
    {
      key: 'legalRisk',
      label: 'Legal & Contractual Risk',
      icon: <Scale className="w-4 h-4 text-blue-600" />,
      description: 'Termination, penalties, liquidated damages & liability clauses'
    },
    {
      key: 'operationalRisk',
      label: 'Operational Risk',
      icon: <Wrench className="w-4 h-4 text-purple-600" />,
      description: 'Delivery timelines, manpower, SLAs & implementation burden'
    },
    {
      key: 'eligibilityRisk',
      label: 'Eligibility Risk',
      icon: <Award className="w-4 h-4 text-amber-600" />,
      description: 'Prior experience, certifications, registrations & OEM restrictions'
    },
    {
      key: 'complianceRisk',
      label: 'Compliance Risk',
      icon: <FileCheck className="w-4 h-4 text-teal-600" />,
      description: 'Mandatory documentation, ambiguity & submission criteria'
    }
  ];

  const getBadgeStyle = (score) => {
    if (score <= 20) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score <= 40) return 'bg-green-100 text-green-800 border-green-200';
    if (score <= 60) return 'bg-amber-100 text-amber-900 border-amber-200';
    if (score <= 80) return 'bg-orange-100 text-orange-900 border-orange-200';
    return 'bg-red-100 text-red-950 border-red-200';
  };

  const getBarColor = (score) => {
    if (score <= 20) return 'bg-emerald-500';
    if (score <= 40) return 'bg-green-500';
    if (score <= 60) return 'bg-amber-500';
    if (score <= 80) return 'bg-orange-500';
    return 'bg-red-600';
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
<<<<<<< HEAD
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-orange-100/80 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-orange-100 text-orange-700">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-heading font-extrabold text-slate-900 text-lg">
              Risk Category Intelligence (7 Core Dimensions)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Evaluates eligibility, financial, technical, documentation, timeline, contractual & commercial risks
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100/80 text-orange-800 border border-orange-200">
          7 Categories Indexed
        </span>
      </div>

      {/* Grid of 7 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          // Resolve data from primary or fallback keys
          let data = categoryScores[cat.key];
          if (!data && cat.fallbackKeys) {
            for (const fk of cat.fallbackKeys) {
              if (categoryScores[fk]) {
                data = categoryScores[fk];
                break;
              }
            }
          }

          if (!data) {
            data = {
              score: 25,
              level: 'LOW',
              summary: `${cat.label} parameters align with standard tender conditions.`,
              sourcePage: null,
              section: null
            };
          }

          const score = Math.round(data.score || 25);
          const levelInfo = getRiskLevelBadge(score, data.level);
=======
      <div className="flex items-center gap-2 pb-3 border-b border-orange-100/80">
        <span className="p-2 rounded-lg bg-orange-100/80 text-orange-700">
          <Layers className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-heading font-extrabold text-slate-900 text-lg">
            Category Risk Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Evaluating key risk dimensions across 5 core procurement vectors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const data = categoryScores[cat.key] || { score: 30, level: 'Low', summary: 'Standard parameters', majorFactors: [] };
          const score = Math.round(data.score || 0);
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

          return (
            <div
              key={cat.key}
<<<<<<< HEAD
              className="bg-white p-4 rounded-xl border border-slate-100 hover:border-orange-200 shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Category Title & Level Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <span className="shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase border tracking-wide shrink-0 ${levelInfo.badge}`}>
                    {levelInfo.label}
                  </span>
                </div>

                {/* Score & Visual Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900 font-heading text-sm">
                      Score: {score} / 100
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Risk Score</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${levelInfo.bar}`}
=======
              className="bg-white/90 p-4 rounded-xl border border-slate-100 hover:border-orange-200 shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    {cat.icon}
                    {cat.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${getBadgeStyle(score)}`}>
                    {data.level || 'Low'}
                  </span>
                </div>

                {/* Score & Progress */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900 font-heading text-sm">{score} / 100</span>
                    <span className="text-[11px] text-slate-400 font-medium">Risk Score</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

<<<<<<< HEAD
                {/* Short Explanation */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {data.summary || cat.description}
                </p>
              </div>

              {/* Source Evidence Reference */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                {data.sourcePage || data.page ? (
                  <span className="flex items-center gap-1 font-semibold text-slate-700 truncate max-w-[160px]" title={data.section || `Page ${data.sourcePage || data.page}`}>
                    <FileText className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{data.section ? `${data.section} • ` : ''}Page {data.sourcePage || data.page}</span>
                  </span>
                ) : (
                  <span className="italic text-slate-400">
                    Source reference unavailable
                  </span>
                )}

                {(data.sourcePage || data.page || data.sourceText) && onOpenSource && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenSource({
                        value: `${cat.label} (${levelInfo.label} RISK)`,
                        sourceText: data.sourceText || data.summary,
                        section: data.section || cat.label,
                        page: data.sourcePage || data.page || 1
                      })
                    }
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer hover:underline shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View in PDF</span>
                  </button>
                )}
              </div>

=======
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {data.summary}
                </p>
              </div>

              {/* Major Factors List */}
              {Array.isArray(data.majorFactors) && data.majorFactors.length > 0 && (
                <div className="pt-2.5 border-t border-slate-100 text-[11px] space-y-1">
                  <span className="font-bold text-slate-400 block uppercase text-[10px] tracking-wider">
                    Key Drivers:
                  </span>
                  <ul className="space-y-1 text-slate-700 font-medium">
                    {data.majorFactors.slice(0, 3).map((factor, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1">
                        <span className="text-orange-500 font-bold shrink-0">•</span>
                        <span className="line-clamp-1">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
            </div>
          );
        })}
      </div>
<<<<<<< HEAD

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    </div>
  );
};
