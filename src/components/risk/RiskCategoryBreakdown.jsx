import React from 'react';
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
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
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

          return (
            <div
              key={cat.key}
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
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

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
            </div>
          );
        })}
      </div>
    </div>
  );
};
