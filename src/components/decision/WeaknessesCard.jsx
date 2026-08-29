import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const WeaknessesCard = ({ weaknesses = [] }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-amber-100 bg-white space-y-4 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-slate-900 text-sm">
            Weaknesses & Liabilities ({weaknesses.length})
          </h3>
          <p className="text-[11px] text-slate-500">Risk exposures requiring active operational safeguards</p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {weaknesses.map((weakness, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{extractText(weakness)}</span>
          </li>
        ))}
        {weaknesses.length === 0 && (
          <li className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl">
            No critical weaknesses identified for this evaluation.
          </li>
        )}
      </ul>
    </div>
  );
};

