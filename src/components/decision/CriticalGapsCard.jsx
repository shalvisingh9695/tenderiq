import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const CriticalGapsCard = ({ criticalGaps = [] }) => {
  if (!criticalGaps || criticalGaps.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-rose-50/90 border border-rose-200 space-y-3 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
        Critical Qualification Gaps ({criticalGaps.length})
      </div>
      <p className="text-xs text-rose-800 leading-relaxed">
        The following mandatory tender requirements or disqualifying gaps prevent this tender from qualifying for an immediate "Apply" recommendation:
      </p>
      <ul className="space-y-2 pl-1">
        {criticalGaps.map((gap, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-rose-950 font-medium bg-white/60 p-2.5 rounded-xl border border-rose-200/60">
            <span className="text-rose-600 font-bold">•</span>
            <span>{extractText(gap)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

