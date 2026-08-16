import React from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
<<<<<<< HEAD
import { extractText } from '../../utils/textHelper';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

export const StrengthsCard = ({ strengths = [] }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-emerald-100 bg-white space-y-4 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-slate-900 text-sm">
            Competitive Strengths ({strengths.length})
          </h3>
          <p className="text-[11px] text-slate-500">Key capability alignments and strategic advantages</p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {strengths.map((strength, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
<<<<<<< HEAD
            <span>{extractText(strength)}</span>
=======
            <span>{strength}</span>
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </li>
        ))}
        {strengths.length === 0 && (
          <li className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl">
            No specific strengths identified for this profile.
          </li>
        )}
      </ul>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
