import React from 'react';

export const DecisionScoreCard = ({ title, score, icon: Icon, color, description }) => {
  const colorMap = {
    orange: {
      text: 'text-orange-500',
      bg: 'bg-orange-500',
      border: 'border-orange-100',
      iconBg: 'bg-orange-50 text-orange-600'
    },
    rose: {
      text: 'text-rose-500',
      bg: 'bg-rose-500',
      border: 'border-rose-100',
      iconBg: 'bg-rose-50 text-rose-600'
    },
    emerald: {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    blue: {
      text: 'text-blue-500',
      bg: 'bg-blue-500',
      border: 'border-blue-100',
      iconBg: 'bg-blue-50 text-blue-600'
    }
  };

  const activeColor = colorMap[color] || colorMap.orange;

  return (
    <div className={`glass-card p-5 rounded-2xl border ${activeColor.border} bg-white space-y-3 shadow-xs`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`p-2 rounded-xl ${activeColor.iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-bold text-slate-800">{title}</span>
        </div>
        <span className="font-heading font-extrabold text-sm text-slate-900">
          {score}/100
        </span>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className={`${activeColor.bg} h-full rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 leading-snug">
          {description}
        </p>
      )}
    </div>
  );
};
