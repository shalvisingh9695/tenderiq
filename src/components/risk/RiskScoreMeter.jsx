import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

export const RiskScoreMeter = ({ score = 0, level = 'Moderate' }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  // Determine theme color based on risk level
  const getLevelConfig = (lvl, sc) => {
    if (sc <= 20 || lvl === 'Very Low') {
      return {
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        progressBg: 'bg-emerald-500',
        textGradient: 'from-emerald-700 to-teal-800',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        description: 'Minimal risk detected. Favorable commercial & legal conditions.'
      };
    }
    if (sc <= 40 || lvl === 'Low') {
      return {
        badgeBg: 'bg-green-100 text-green-800 border-green-200',
        progressBg: 'bg-green-500',
        textGradient: 'from-green-700 to-emerald-800',
        icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
        description: 'Manageable risk profile with standard procurement terms.'
      };
    }
    if (sc <= 60 || lvl === 'Moderate') {
      return {
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
        progressBg: 'bg-amber-500',
        textGradient: 'from-amber-700 to-orange-800',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        description: 'Moderate risks present in operational or financial commitments.'
      };
    }
    if (sc <= 80 || lvl === 'High') {
      return {
        badgeBg: 'bg-orange-100 text-orange-950 border-orange-200',
        progressBg: 'bg-orange-500',
        textGradient: 'from-orange-700 to-red-800',
        icon: <ShieldAlert className="w-5 h-5 text-orange-600" />,
        description: 'High risk exposure. Demands careful legal & financial review.'
      };
    }
    return {
      badgeBg: 'bg-red-100 text-red-950 border-red-200',
      progressBg: 'bg-red-600',
      textGradient: 'from-red-700 to-rose-900',
      icon: <Flame className="w-5 h-5 text-red-600" />,
      description: 'Critical risk factors. Potential disqualification or severe penalties.'
    };
  };

  const config = getLevelConfig(level, normalizedScore);

  return (
    <div className="bg-white/90 p-5 rounded-2xl border border-orange-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          {config.icon}
          Composite Risk Index
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${config.badgeBg}`}>
          {level} Risk
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className={`font-heading text-4xl sm:text-5xl font-extrabold bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent`}>
          {normalizedScore}
        </span>
        <span className="text-sm font-semibold text-slate-400">/ 100</span>
      </div>

      {/* Meter Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ${config.progressBg}`}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>

        {/* Range Labels */}
        <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-0.5">
          <span>0 (Low)</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100 (Critical)</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-medium">
        {config.description}
      </p>
    </div>
  );
};
