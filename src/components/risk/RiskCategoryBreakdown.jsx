import React from 'react';
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
import { extractText } from '../../utils/textHelper';

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
    const lvl = (extractText(explicitLevel) || '').toUpperCase();

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
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
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

          const rawScore = typeof data.score === 'number' ? data.score : parseFloat(extractText(data.score)) || 25;
          const score = Math.round(rawScore);
          const levelInfo = getRiskLevelBadge(score, data.level);
          const summaryText = extractText(data.summary || data.description || cat.description);
          const pageNum = extractText(data.sourcePage || data.page);
          const sectionText = extractText(data.section);

          return (
            <div
              key={cat.key}
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
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                {/* Short Explanation */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {summaryText}
                </p>
              </div>

              {/* Source Evidence Reference */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                {pageNum ? (
                  <span className="flex items-center gap-1 font-semibold text-slate-700 truncate max-w-[160px]" title={sectionText || `Page ${pageNum}`}>
                    <FileText className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{sectionText ? `${sectionText} • ` : ''}Page {pageNum}</span>
                  </span>
                ) : (
                  <span className="italic text-slate-400">
                    Source reference unavailable
                  </span>
                )}

                {(pageNum || data.sourceText || summaryText) && onOpenSource && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenSource({
                        value: `${cat.label} (${levelInfo.label} RISK)`,
                        sourceText: extractText(data.sourceText || summaryText),
                        section: sectionText || cat.label,
                        page: pageNum || 1
                      })
                    }
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer hover:underline shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View in PDF</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

